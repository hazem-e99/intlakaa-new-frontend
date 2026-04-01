import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { type ReactNode, useEffect } from "react";

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden text-right" dir="rtl">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pr-64">
        <Header />

        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 sm:p-6 text-right">
          <div className="mx-auto max-w-7xl w-full">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
