"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Car,
  CarFront,
  Contact,
  Home,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "wakim",
    role: "admin",
    avatar:
      "https://armzdhwelkuwwftkvoap.supabase.co/storage/v1/object/public/profile//avatar.png",
  },

  navMain: [
    {
      title: "หน้าหลัก",
      href: "/admin/",
      icon: Home,
    },
    {
      title: "ข้อมูลลูกค้า",
      href: "/admin/customers",
      icon: UsersRound,
    },
    {
      title: "ข้อมูลพนักงานขับรถ",
      href: "/admin/drivers",
      icon: Contact,
    },
    {
      title: "ข้อมูลรายการจองรถ",
      href: "/admin/reservations",
      icon: Calendar,
    },
    {
      title: "ยานพาหนะ",
      href: "/admin/vehicles",
      icon: Car,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <CarFront className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-md">
                    TOR for FleetFlex
                  </span>
                  <span className="text-xs text-muted-foreground">v.1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.map(({ href, ...rest }) => ({
            url: href,
            ...rest,
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
