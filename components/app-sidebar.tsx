"use client";

import {
  Calendar,
  Car,
  CarFront,
  Contact,
  Home,
  Loader2,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
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
import { useSession } from "@/hooks/useSession";

// Navigation menu data - moved outside component to avoid recreation
const navItems = [
  { title: "หน้าหลัก", href: "/admin/", icon: Home },
  { title: "ข้อมูลลูกค้า", href: "/admin/customers", icon: UsersRound },
  { title: "ข้อมูลพนักงานขับรถ", href: "/admin/drivers", icon: Contact },
  { title: "ข้อมูลรายการจองรถ", href: "/admin/reservations", icon: Calendar },
  { title: "ยานพาหนะ", href: "/admin/vehicles", icon: Car },
];

/**
 * Generate initials from an email or name
 */
function getInitials(text: string): string {
  if (!text) return "UN";

  // Handle email addresses
  if (text.includes("@")) {
    const localPart = text.split("@")[0];
    return localPart.length === 1
      ? localPart.toUpperCase()
      : localPart.substring(0, 2).toUpperCase();
  }

  // Handle names
  const words = text.split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, Math.min(2, words[0].length)).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useSession();
  const [userData, setUserData] = React.useState({
    name: "User",
    role: "guest",
    initials: "UN",
  });

  React.useEffect(() => {
    if (user) {
      const email = user.email || "User";
      setUserData({
        name: email,
        role: user.role || "guest",
        initials: getInitials(email),
      });
    }
  }, [user]);

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
          items={navItems.map(({ href, ...rest }) => ({
            url: href,
            ...rest,
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <NavUser user={userData} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
