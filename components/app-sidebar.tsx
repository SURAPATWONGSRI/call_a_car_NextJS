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
      "https://scontent.fbkk5-5.fna.fbcdn.net/v/t39.30808-6/486866698_2452730145067243_2758720085003566629_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHIvsoiDAayw8Kx2uIUgT00W9RCQDEfAp9b1EJAMR8Cn7fgG61MwdOrp22_04M9-YIEhm817HSLUNJvjUYuM_S2&_nc_ohc=45UlmWNH2TwQ7kNvwHXEE8N&_nc_oc=AdmA6rD-NQz1DZnP83ujAbvtZJhL0l8xAehRR5hdF16FwQLQDTLv7Eho0cOJUjnekgl5XrCrv_EppxoKfLMv94a5&_nc_zt=23&_nc_ht=scontent.fbkk5-5.fna&_nc_gid=tpRh0NJ2BdbWZHevtYwu2A&oh=00_AfLdwiMPg0cLbP27j0M0M1DRcj_fKbJ_k6cIlKjqmWf77Q&oe=6822F76B",
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
