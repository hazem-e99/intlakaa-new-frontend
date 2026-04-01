import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  Search,
  Settings,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { logout, getUserRole } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "الطلبات",
    href: "/admin/requests",
    icon: FileText,
  },
  {
    name: "الصفحات والمحتوى",
    href: "/admin/pages",
    icon: Globe,
  },
  {
    name: "إدارة الأدمنز",
    href: "/admin/manage-admins",
    icon: Users,
  },
  {
    name: "إدارة SEO",
    href: "/admin/seo-management",
    icon: Search,
  },
  {
    name: "الإعدادات",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Get user role on mount
  useEffect(() => {
    const role = getUserRole();
    setUserRole(role || "admin");
  }, []);

  // Filter navigation based on role
  const filteredNavigation = navigation.filter(item => {
    // Hide "إدارة الأدمنز" for non-owners
    if (item.href === "/admin/manage-admins" && userRole !== "owner") {
      return false;
    }
    return true;
  });

  const handleLogout = () => {
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
    logout();
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col text-right" dir="rtl">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b px-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          لوحة الإدارة
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = item.href === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors justify-start",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed right-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 right-0 z-40 w-64 border-l bg-background md:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:fixed md:inset-y-0 md:right-0 md:flex md:w-64 md:flex-col md:border-l md:bg-background",
          className
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
