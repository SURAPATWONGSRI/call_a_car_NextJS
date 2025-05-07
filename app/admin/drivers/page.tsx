"use client";

import { AddDriverDialog } from "@/components/drivers/add-driver-dialog";
import { DriversDataTable } from "@/components/drivers/drivers-data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

const DriversPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            รายชื่อคนขับรถ
          </h1>
          <p className="text-muted-foreground">
            จัดการข้อมูลและสิทธิ์ของคนขับรถทั้งหมดในระบบ
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto justify-center"
        >
          <PlusCircle className="h-5 w-5" />
          เพิ่มคนขับรถ
        </Button>
      </div>

      <div className="bg-background rounded-lg border shadow-sm w-full overflow-hidden">
        <div className="p-3 sm:p-4">
          <DriversDataTable />
        </div>
      </div>

      <AddDriverDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default DriversPage;
