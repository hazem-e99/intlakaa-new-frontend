import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/layout/AdminLayout";

type AdminPageWrapperProps = {
  children: ReactNode;
};

export function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
