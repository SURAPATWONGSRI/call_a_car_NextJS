"use client";

import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { DriverForm } from "@/components/drivers/driver-form";
import { DriversDataTable } from "@/components/drivers/drivers-data-table";
import { EditDriverForm } from "@/components/drivers/edit-driver-form";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types/driver";
import { PlusCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import * as z from "zod";

// Create a fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch drivers");
  return res.json();
};

const DriversPage = () => {
  const [open, setOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");

  // Use SWR for data fetching with caching
  const {
    data: drivers = [],
    error: fetchError,
    isLoading: loading,
    mutate,
  } = useSWR("/api/drivers", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000, // Avoid refetching within 10 seconds
  });

  // Show error toast if fetch fails
  useEffect(() => {
    if (fetchError) {
      toast.error("ไม่สามารถโหลดรายชื่อคนขับรถได้");
      console.error("Error fetching drivers:", fetchError);
    }
  }, [fetchError]);

  // Handle the edit parameter in a separate effect
  useEffect(() => {
    if (editParam && drivers.length > 0) {
      const driverToEdit = drivers.find(
        (d: Driver) => d.id.toString() === editParam
      );
      if (driverToEdit) {
        setSelectedDriver(driverToEdit);
        setEditFormOpen(true);
      }
    }
  }, [editParam, drivers]);

  async function handleDriverSubmit(
    values: z.infer<
      typeof import("@/components/drivers/driver-form").driverFormSchema
    >
  ) {
    try {
      setIsSubmitting(true);
      const driverData = {
        ...values,
        active: true,
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
      mutate();
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

    const newUrl = `/admin/drivers?edit=${driver.id}`;
    window.history.pushState({}, "", newUrl);
  };

  // Handle edit form close - remove URL param without triggering refresh
  const handleEditFormOpenChange = (open: boolean) => {
    setEditFormOpen(open);
    if (!open) {
      window.history.pushState({}, "", "/admin/drivers");
    }
  };

  const handleDeleteDriver = (driver: Driver) => {
    setDriverToDelete(driver);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = useCallback(async () => {
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

      // Refresh data using SWR's mutate
      mutate();

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
  }, [driverToDelete, mutate]);

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

      // Refresh data using SWR's mutate
      mutate();

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

      <DriverForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleDriverSubmit}
        isSubmitting={isSubmitting}
      />

      <EditDriverForm
        open={editFormOpen}
        onOpenChange={handleEditFormOpenChange}
        driver={selectedDriver}
        onSubmit={handleDriverUpdate}
        isSubmitting={isSubmitting}
      />

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
