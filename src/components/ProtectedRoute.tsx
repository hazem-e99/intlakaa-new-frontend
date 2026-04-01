import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "@/services/authService";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user has token
      if (!isAuthenticated()) {
        setIsAuth(false);
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const result = await getCurrentUser();

      if (result.success) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">جاري التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    // Redirect to login but save the attempted location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
