import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, inviteUser, updateUserRole, deleteUser } from "@/services/userService";
import { getUserRole } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, UserPlus, Mail } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    id: string;
    email: string;
    role: 'owner' | 'admin';
    createdAt: string;
    lastSignInAt?: string;
    isActive: boolean;
    mustChangePassword: boolean;
}

export default function ManageAdmins() {
    const [email, setEmail] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Check if user is owner
    useEffect(() => {
        const role = getUserRole();
        if (role !== "owner") {
            toast({
                title: "غير مصرح",
                description: "ليس لديك صلاحية للوصول إلى هذه الصفحة",
                variant: "destructive",
            });
            navigate("/admin");
        }
    }, [navigate, toast]);

    // Fetch all admin users
    const {
        data: users,
        isLoading,
        isError,
        error,
    } = useQuery<User[]>({
        queryKey: ["admin-users"],
        queryFn: getAllUsers,
        staleTime: 30000,
    });

    // Invite user mutation
    const inviteMutation = useMutation({
        mutationFn: inviteUser,
        onSuccess: () => {
            toast({
                title: "تم إرسال الدعوة بنجاح",
                description: "تم إرسال رسالة الدعوة إلى البريد الإلكتروني",
            });
            setEmail("");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (error: Error) => {
            toast({
                title: "فشل إرسال الدعوة",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Delete user mutation
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast({
                title: "تم حذف المستخدم",
                description: "تم حذف المستخدم بنجاح",
            });
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (error: Error) => {
            toast({
                title: "فشل حذف المستخدم",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Update user role mutation
    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, newRole }: { userId: string; newRole: 'owner' | 'admin' }) =>
            updateUserRole(userId, newRole),
        onSuccess: () => {
            toast({
                title: "تم تحديث الدور",
                description: "تم تحديث دور المستخدم بنجاح",
            });
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (error: Error) => {
            toast({
                title: "فشل تحديث الدور",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast({
                title: "خطأ",
                description: "يرجى إدخال البريد الإلكتروني",
                variant: "destructive",
            });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: "خطأ",
                description: "يرجى إدخال بريد إلكتروني صحيح",
                variant: "destructive",
            });
            return;
        }

        inviteMutation.mutate(email);
    };

    const handleDelete = (userId: string) => {
        deleteMutation.mutate(userId);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">إدارة الأدمنز</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    إضافة وإدارة مستخدمي لوحة التحكم
                </p>
            </div>

            {/* Invite Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <UserPlus className="h-5 w-5" />
                        دعوة أدمن جديد
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={inviteMutation.isPending}
                                        className="pr-9"
                                        dir="ltr"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={inviteMutation.isPending}
                                    className="gap-2 w-full sm:w-auto"
                                >
                                    {inviteMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            جاري الإرسال...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4" />
                                            إرسال الدعوة
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                سيتم إرسال رسالة دعوة إلى البريد الإلكتروني المدخل
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">قائمة المستخدمين</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                            <p className="font-medium">خطأ في تحميل المستخدمين</p>
                            <p className="text-sm">{(error as Error).message}</p>
                        </div>
                    )}

                    {/* Table */}
                    {!isLoading && !isError && (
                        <>
                            {users && users.length > 0 ? (
                                <>
                                    {/* Desktop Table View */}
                                    <div className="hidden md:block rounded-md border overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-right">
                                                        البريد الإلكتروني
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        الدور
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        تاريخ الإنشاء
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        آخر تسجيل دخول
                                                    </TableHead>
                                                    <TableHead className="text-right w-24">
                                                        الإجراءات
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="font-medium" dir="ltr">
                                                            {user.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                value={user.role}
                                                                onValueChange={(newRole: 'owner' | 'admin') => {
                                                                    updateRoleMutation.mutate({
                                                                        userId: user.id,
                                                                        newRole
                                                                    });
                                                                }}
                                                                disabled={updateRoleMutation.isPending}
                                                            >
                                                                <SelectTrigger className="w-[120px]">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="owner">Owner</SelectItem>
                                                                    <SelectItem value="admin">Admin</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatDate(user.createdAt)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {user.lastSignInAt
                                                                ? formatDate(user.lastSignInAt)
                                                                : "لم يسجل دخول بعد"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                        disabled={deleteMutation.isPending}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            هل أنت متأكد؟
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            سيتم حذف المستخدم{" "}
                                                                            <span className="font-semibold">
                                                                                {user.email}
                                                                            </span>{" "}
                                                                            نهائياً. لا يمكن التراجع عن هذا الإجراء.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(user.id)}
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                        >
                                                                            حذف
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="md:hidden space-y-3">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="rounded-lg border p-4 space-y-3"
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm break-all" dir="ltr">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 shrink-0"
                                                                disabled={deleteMutation.isPending}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    هل أنت متأكد؟
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    سيتم حذف المستخدم{" "}
                                                                    <span className="font-semibold break-all">
                                                                        {user.email}
                                                                    </span>{" "}
                                                                    نهائياً. لا يمكن التراجع عن هذا الإجراء.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                                                <AlertDialogCancel className="w-full sm:w-auto">إلغاء</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(user.id)}
                                                                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                                                                >
                                                                    حذف
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between items-center pb-2 border-b">
                                                        <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                                                        <span className="font-medium text-xs sm:text-sm">
                                                            {formatDate(user.createdAt)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-muted-foreground">آخر تسجيل دخول:</span>
                                                        <span className="font-medium text-xs sm:text-sm">
                                                            {user.lastSignInAt
                                                                ? formatDate(user.lastSignInAt)
                                                                : "لم يسجل دخول بعد"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-md border border-dashed p-12 text-center">
                                    <p className="text-sm sm:text-base text-muted-foreground">
                                        لا يوجد مستخدمون حالياً
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
