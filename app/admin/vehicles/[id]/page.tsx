"use client";

import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { EditVehicleDialog } from "@/components/edit-vehicle-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Vehicle } from "@/types/vehicle";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? parseInt(params.id) : null;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeletingVehicle, setIsDeletingVehicle] = useState<boolean>(false);

  // Fetch vehicle data
  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("รหัสยานพาหนะไม่ถูกต้อง");
      setIsLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("ไม่พบข้อมูลยานพาหนะ");
          }
          throw new Error(`เกิดข้อผิดพลาด: ${response.status}`);
        }

        const data = await response.json();
        setVehicle(data.vehicle);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล"
        );
        console.error("Error fetching vehicle:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  // Handle saving vehicle updates
  const handleSaveVehicle = async (updatedVehicle: Vehicle) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVehicle),
      });

      if (!response.ok) {
        let errorMessage = `Failed to update vehicle (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setVehicle(data.vehicle);

      toast("Vehicle updated", {
        description: "The vehicle has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to update vehicle",
      });
    }
  };

  // Handle vehicle deletion
  const handleDeleteVehicle = async () => {
    setIsDeletingVehicle(true);
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Failed to delete vehicle (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
        }
        throw new Error(errorMessage);
      }

      toast("Vehicle deleted", {
        description: "The vehicle has been deleted successfully.",
      });

      // Navigate back to vehicles list
      router.push("/admin/vehicles");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to delete vehicle",
      });
    } finally {
      setIsDeletingVehicle(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/admin/vehicles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปยังรายการยานพาหนะ
          </Link>
        </Button>

        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/admin/vehicles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปยังรายการยานพาหนะ
          </Link>
        </Button>

        <div className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded">
          <p>ไม่พบข้อมูลยานพาหนะ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin/vehicles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปยังรายการยานพาหนะ
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {vehicle.brand} {vehicle.model || ""} {vehicle.variant || ""} (
          {vehicle.licensePlate})
        </h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
            แก้ไข
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            ลบ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลยานพาหนะ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">ทะเบียนรถ</p>
              <p className="font-medium">{vehicle.licensePlate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">ยี่ห้อ</p>
              <p className="font-medium">{vehicle.brand}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">รุ่น</p>
              <p className="font-medium">{vehicle.model || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">รุ่นย่อย</p>
              <p className="font-medium">{vehicle.variant || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">ประเภทรถ</p>
              <p className="font-medium">{vehicle.type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">สถานะ</p>
              <p className="font-medium">
                {vehicle.active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ใช้งานได้
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ไม่ได้ใช้งาน
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>รูปภาพ</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicle.imageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image
                  src={vehicle.imageUrl}
                  alt={`${vehicle.brand} ${vehicle.licensePlate}`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video w-full bg-slate-100 rounded-md flex items-center justify-center">
                <p className="text-slate-500">ไม่มีรูปภาพ</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <EditVehicleDialog
        vehicle={vehicle}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveVehicle}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteVehicle}
        isLoading={isDeletingVehicle}
        title="ลบยานพาหนะ"
        description={`คุณต้องการลบ ${vehicle.brand} ${vehicle.licensePlate} ใช่หรือไม่?`}
      />
    </div>
  );
}
