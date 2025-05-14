import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
