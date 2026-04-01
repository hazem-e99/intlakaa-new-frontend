import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { acceptInvite } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, CheckCircle2, XCircle } from "lucide-react";

export default function AcceptInvite() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get token from URL query parameter
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "خطأ",
        description: "رابط الدعوة غير صالح",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      return toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
    }

    if (password !== confirmPassword) {
      return toast({
        title: "خطأ",
        description: "كلمتا المرور غير متطابقتين",
        variant: "destructive",
      });
    }

    setIsLoading(true);

    try {
      const result = await acceptInvite(token, password);

      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: "تم قبول الدعوة بنجاح. مرحباً بك!",
        });

        // Redirect to admin dashboard
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل قبول الدعوة",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء قبول الدعوة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-md shadow-lg border-red-200">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-center text-red-600">
              رابط غير صالح
            </CardTitle>
            <CardDescription className="text-center">
              رابط الدعوة غير صالح أو منتهي الصلاحية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/admin/login")} className="w-full">
              العودة لتسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">قبول الدعوة</CardTitle>
          <CardDescription>
            يرجى إدخال كلمة مرور جديدة لحسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "قبول الدعوة وتعيين كلمة المرور"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>بعد تعيين كلمة المرور، سيتم تسجيل دخولك تلقائياً</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
