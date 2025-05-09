"use client";

import { AddDriverDialog } from "@/components/drivers/add-driver-dialog";
import { DriversDataTable } from "@/components/drivers/drivers-data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Driver type definition
type Driver = {
  id: string;
  name: string;
  phone: string;
  active: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

const DriversPage = () => {
  const [open, setOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/drivers");
        if (!response.ok) {
          throw new Error("Failed to fetch drivers");
        }
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            รายชื่อพนักงานขับรถ
          </h2>
          <p className="text-muted-foreground">จัดการข้อมูลของคนขับรถทั้งหมด</p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          size="default"
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          เพิ่มคนขับรถ
        </Button>
      </div>

      <div className="p-6">
        <DriversDataTable drivers={drivers} loading={loading} />
      </div>

      <AddDriverDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default DriversPage;
