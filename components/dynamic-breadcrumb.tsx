"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Maps for Thai translations if needed
const segmentTitles: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  customers: "ข้อมูลลูกค้า",
  drivers: "คนขับรถ",
  reservations: "การจองรถ",
  vehicles: "ยานพาหนะ",
};

export function DynamicBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Special handling for mobile view: show only current page or a shortened breadcrumb
  const isMobileView = pathSegments.length > 2;
  const currentSegment = pathSegments[pathSegments.length - 1];
  const currentTitle =
    segmentTitles[currentSegment] ||
    currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1);

  return (
    <div className={cn("flex items-center", className)}>
      {/* Mobile optimized view - show only current page or shortened breadcrumb */}
      <div className="md:hidden flex items-center">
        {isMobileView && (
          <>
            <Link
              href={`/${pathSegments[0]}`}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {segmentTitles[pathSegments[0]] || pathSegments[0]}
            </Link>
            <ChevronRight className="mx-1 size-3 text-muted-foreground" />
            <span className="text-sm font-medium">{currentTitle}</span>
          </>
        )}

        {!isMobileView && pathSegments.length > 0 && (
          <span className="text-sm font-medium">{currentTitle}</span>
        )}
      </div>

      {/* Desktop view - full breadcrumb */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {pathSegments.slice(1).map((segment, index) => (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index < pathSegments.slice(1).length - 1 ? (
                  <BreadcrumbLink
                    href={`/${pathSegments.slice(0, index + 2).join("/")}`}
                  >
                    {segmentTitles[segment] ||
                      segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>
                    {segmentTitles[segment] ||
                      segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
