import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { ModeToggle } from "@/components/toggletheme";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b">
      <div className="flex items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <DynamicBreadcrumb />
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-4 px-4">
        <ModeToggle />
      </div>
    </header>
  );
}
