"use client";

import { DriverForm } from "@/components/drivers/driver-form";
import { DriversDataTable } from "@/components/drivers/drivers-data-table";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types/driver";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import * as z from "zod";

const DriversPage = () => {
  const [open, setOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleDriverSubmit(
    values: z.infer<
      typeof import("@/components/drivers/driver-form").driverFormSchema
    >
  ) {
    try {
      setIsSubmitting(true);

      // Add default active value to the submission
      const driverData = {
        ...values,
        active: true, // Set default to true when submitting
      };

      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driverData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 409) {
          return {
            success: false,
            error: "ชื่อนี้มีอยู่ในระบบแล้ว",
          };
        } else {
          return {
            success: false,
            error: data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          };
        }
      }

      // Add the new driver to the list
      setDrivers((prev) => [...prev, data]);

      // Show success toast
      toast.success("เพิ่มคนขับรถสำเร็จแล้ว", {
        description: `คุณได้เพิ่ม ${data.name} เข้าสู่ระบบเรียบร้อยแล้ว`,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error submitting form:", error);
      return {
        success: false,
        error: "เกิดข้อผิดพลาดในการติดต่อกับเซิร์ฟเวอร์",
      };
    } finally {
      setIsSubmitting(false);
    }
  }

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

      {/* Use the updated DriverForm component */}
      <DriverForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleDriverSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default DriversPage;
