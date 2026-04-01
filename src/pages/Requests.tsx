import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchAndPaginateRequests,
  getRequests,
  deleteRequest,
  type Request,
  type PaginatedResponse,
} from "@/services/requestsService";
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
import { Button } from "@/components/ui/button";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Download,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { exportToExcel } from "@/utils/excelExport";
import { useToast } from "@/hooks/use-toast";
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

export default function Requests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const itemsPerPage = 10;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch requests with React Query
  const {
    data: requestsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<PaginatedResponse>({
    queryKey: ["requests", debouncedSearch, currentPage],
    queryFn: () =>
      searchAndPaginateRequests(debouncedSearch, currentPage, itemsPerPage),
    staleTime: 30000, // 30 seconds
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الطلب بنجاح",
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل الحذف",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (requestsData && currentPage < requestsData.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy، HH:mm", { locale: undefined });
    } catch {
      return dateString;
    }
  };

  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      // Fetch all requests (not paginated) for export
      const allRequestsResponse = await getRequests(1, 1000, "");
      const allRequests = allRequestsResponse.data;

      if (!allRequests || allRequests.length === 0) {
        toast({
          title: "لا توجد بيانات",
          description: "لا توجد طلبات لتصديرها.",
          variant: "destructive",
        });
        return;
      }

      // Export to Excel
      await exportToExcel(allRequests, "requests_export.xlsx");

      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير ${allRequests.length} طلب إلى ملف Excel.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "فشل التصدير",
        description: "حدث خطأ أثناء تصدير البيانات. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requestsData?.count || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الصفحة الحالية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentPage} / {requestsData?.totalPages || 1}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              النتائج في الصفحة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requestsData?.data.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle className="text-lg sm:text-xl">طلبات العملاء</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
              {/* Search Input */}
              <div className="relative w-full sm:flex-1 sm:max-w-xs">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالاسم أو رقم الهاتف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
              <div className="flex gap-2">
                {/* Export Button */}
                <Button
                  variant="default"
                  onClick={handleExportToExcel}
                  disabled={isExporting || isLoading}
                  className="gap-2 flex-1 sm:flex-initial"
                  size="sm"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">جاري التصدير...</span>
                      <span className="sm:hidden">تصدير...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">تصدير كملف Excel</span>
                      <span className="sm:hidden">تصدير</span>
                    </>
                  )}
                </Button>
                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isFetching}
                  className="h-9 w-9"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
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
              <p className="font-medium">خطأ في تحميل الطلبات</p>
              <p className="text-sm">{(error as Error).message}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-2"
              >
                حاول مرة أخرى
              </Button>
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && (
            <>
              {requestsData && requestsData.data.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">الاسم</TableHead>
                          <TableHead className="text-right">الهاتف</TableHead>
                          <TableHead className="text-right">رابط المتجر</TableHead>
                          <TableHead className="text-right">المبيعات الشهرية</TableHead>
                          <TableHead className="text-right">عنوان الجهاز</TableHead>
                          <TableHead className="text-right">الدولة</TableHead>
                          <TableHead className="text-right">مفتاح الدولة</TableHead>
                          <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                          <TableHead className="text-right w-24">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requestsData.data.map((request: Request) => (
                          <TableRow key={request._id}>
                            <TableCell>{request.name}</TableCell>
                            <TableCell dir="ltr" className="text-right">{request.phone}</TableCell>
                            <TableCell>
                              {request.storeUrl ? (
                                <a
                                  href={request.storeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {request.storeUrl.substring(0, 30)}
                                  {request.storeUrl.length > 30 ? "..." : ""}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {request.monthlySales}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground font-mono" dir="ltr">
                              {request.ipAddress || '-'}
                            </TableCell>
                            <TableCell className="text-sm">
                              {request.country || '-'}
                            </TableCell>
                            <TableCell className="text-sm">
                              {request.phoneCountry || '-'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(request.createdAt)}
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
                                      سيتم حذف طلب{" "}
                                      <span className="font-semibold">
                                        {request.name}
                                      </span>{" "}
                                      نهائياً. لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(request._id)}
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
                    {requestsData.data.map((request: Request) => (
                      <div
                        key={request._id}
                        className="rounded-lg border p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{request.name}</p>
                            <p className="text-sm text-muted-foreground" dir="ltr">
                              {request.phone}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="secondary">
                              {request.monthlySales}
                            </Badge>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
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
                                    سيتم حذف طلب{" "}
                                    <span className="font-semibold">
                                      {request.name}
                                    </span>{" "}
                                    نهائياً. لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                  <AlertDialogCancel className="w-full sm:w-auto">إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(request._id)}
                                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        {request.storeUrl && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">رابط المتجر:</p>
                            <a
                              href={request.storeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline break-all"
                            >
                              {request.storeUrl}
                            </a>
                          </div>
                        )}
                        {request.ipAddress && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">عنوان الجهاز:</p>
                            <p className="text-sm font-mono" dir="ltr">{request.ipAddress}</p>
                          </div>
                        )}
                        {request.country && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">الدولة:</p>
                            <p className="text-sm">{request.country}</p>
                          </div>
                        )}
                        {request.phoneCountry && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">مفتاح الدولة:</p>
                            <p className="text-sm">{request.phoneCountry}</p>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          {formatDate(request.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-md border border-dashed p-12 text-center">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {debouncedSearch
                      ? "لم يتم العثور على طلبات مطابقة لبحثك."
                      : "لا توجد طلبات متاحة."}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {requestsData && requestsData.totalPages > 1 && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                    عرض{" "}
                    {(currentPage - 1) * itemsPerPage + 1} إلى{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      requestsData.count
                    )}{" "}
                    من أصل {requestsData.count} نتيجة
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={
                        currentPage === requestsData.totalPages || isFetching
                      }
                    >
                      التالي
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || isFetching}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      السابق
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
