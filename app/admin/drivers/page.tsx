"use client";

import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { DriverForm } from "@/components/drivers/driver-form";
import { DriversDataTable } from "@/components/drivers/drivers-data-table";
import { EditDriverForm } from "@/components/drivers/edit-driver-form";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types/driver";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import * as z from "zod";

const DriversPage = () => {
  const [open, setOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

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
        toast.error("ไม่สามารถโหลดรายชื่อคนขับรถได้");
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
      toast.success("สำเร็จ", {
        description: `คุณได้เพิ่ม ${data.name} เรียบร้อยแล้ว`,
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

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setEditFormOpen(true);
  };

  const handleDeleteDriver = (driver: Driver) => {
    setDriverToDelete(driver);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!driverToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/drivers/${driverToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete driver");
      }

      // Remove the driver from the list
      setDrivers((prev) =>
        prev.filter((driver) => driver.id !== driverToDelete.id)
      );

      // Show success toast
      toast.success("สำเร็จ", {
        description: `คุณได้ลบข้อมูลของ ${driverToDelete.name} เรียบร้อยแล้ว`,
      });

      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      setIsDeleting(false);
    }
  };

  async function handleDriverUpdate(
    values: z.infer<
      typeof import("@/components/drivers/edit-driver-form").editDriverFormSchema
    >,
    driverId: string
  ) {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/drivers/${driverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "เกิดข้อผิดพลาดในการอัพเดทข้อมูล",
        };
      }

      // Update the driver in the list
      setDrivers((prev) =>
        prev.map((driver) => (driver.id === driverId ? data : driver))
      );

      // Show success toast
      toast.success("สำเร็จ", {
        description: `คุณได้อัพเดทข้อมูลของ ${data.name} เรียบร้อยแล้ว`,
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error updating driver:", error);
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
        <DriversDataTable
          drivers={drivers}
          loading={loading}
          onEdit={handleEditDriver}
          onDelete={handleDeleteDriver}
        />
      </div>

      {/* Use the updated DriverForm component */}
      <DriverForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleDriverSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Add the new EditDriverForm component */}
      <EditDriverForm
        open={editFormOpen}
        onOpenChange={setEditFormOpen}
        driver={selectedDriver}
        onSubmit={handleDriverUpdate}
        isSubmitting={isSubmitting}
      />

      {/* Add the Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="ลบ"
        description={`ต้องการลบข้อมูลของ ${
          driverToDelete?.name || ""
        } ใช่หรือไม่?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DriversPage;
