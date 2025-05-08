"use client";

import { AddVehicleDialog } from "@/components/add-vehicle-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { EditVehicleDialog } from "@/components/edit-vehicle-dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { VehicleCard } from "@/components/vehicle-card";
import { Vehicle } from "@/types/vehicle";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [isDeletingVehicle, setIsDeletingVehicle] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/vehicles");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Check and handle different response structures
      if (Array.isArray(data)) {
        setVehicles(data);
      } else if (data && typeof data === "object") {
        // Check if data contains vehicles array in a nested property
        if (Array.isArray(data.data)) {
          setVehicles(data.data);
        } else if (data.vehicles && Array.isArray(data.vehicles)) {
          setVehicles(data.vehicles);
        } else {
          // If we can't find an array, log the structure and set an empty array
          console.error("Unexpected API response structure:", data);
          setVehicles([]);
        }
      } else {
        console.error("Invalid API response:", data);
        setVehicles([]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vehicles");
      console.error("Error fetching vehicles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleDeleteVehicle = (id: number) => {
    setVehicleToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const saveVehicle = async (updatedVehicle: Vehicle) => {
    try {
      // Use the correct endpoint with ID for PUT requests
      const response = await fetch(`/api/vehicles/${updatedVehicle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVehicle),
      });

      if (!response.ok) {
        // Better error handling for non-200 responses
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

      // More robust JSON parsing
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Error parsing success response:", jsonError);
        throw new Error("Invalid response format from server");
      }

      // Update the vehicles list with the updated vehicle
      setVehicles(
        vehicles.map((v) => (v.id === updatedVehicle.id ? data.vehicle : v))
      );

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

  const confirmDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    setIsDeletingVehicle(true);
    try {
      const response = await fetch(`/api/vehicles/${vehicleToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Better error handling for non-200 responses
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

      // Remove the vehicle from the list
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleToDelete));

      toast("Vehicle deleted", {
        description: "The vehicle has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to delete vehicle",
      });
    } finally {
      setIsDeletingVehicle(false);
      setIsDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles([...vehicles, newVehicle]);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
            ยานพาหนะ
          </h1>
          <p className="text-muted-foreground">ข้อมูลยานพาหนะทั้งหมดในระบบ</p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2 px-4 sm:px-6  w-full sm:w-auto justify-center"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle className="h-5 w-5" />
          เพิ่มยานพาหนะ
        </Button>
      </div>

      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>เกิดข้อผิดพลาด: {error}</p>
          <p className="text-sm">กรุณาลองใหม่อีกครั้ง</p>
        </div>
      )}

      {!isLoading && !error && vehicles.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-12 rounded text-center">
          <p>ไม่พบข้อมูลยานพาหนะ</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.isArray(vehicles) &&
          vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              {...vehicle}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
            />
          ))}
      </div>

      <EditVehicleDialog
        vehicle={selectedVehicle}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={saveVehicle}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteVehicle}
        isLoading={isDeletingVehicle}
        title="ลบ"
        description="คุณต้องการลบยานพาหนะนี้ใช่หรือไม่?"
      />

      <AddVehicleDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddVehicle}
      />
    </div>
  );
};

export default VehiclesPage;
