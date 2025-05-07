import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import React from "react";

import { AdminHeader } from "@/components/admin/header";

export const metadata: Metadata = {
  title: "Admin Dashboard - ระบบบริหารจัดการรถเช่า",
  description: "ระบบบริหารจัดการรถเช่า สำหรับผู้ดูแลระบบ",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
