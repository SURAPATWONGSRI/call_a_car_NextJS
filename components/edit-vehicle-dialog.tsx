import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vehicle } from "@/types/vehicle";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

type EditVehicleDialogProps = {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (vehicle: Vehicle) => void;
};

export const EditVehicleDialog = ({
  vehicle,
  open,
  onOpenChange,
  onSave,
}: EditVehicleDialogProps) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>(vehicle || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch vehicle data when dialog opens and vehicle ID is available
  useEffect(() => {
    if (open && vehicle?.id) {
      fetchVehicleData(vehicle.id);
    }
  }, [open, vehicle?.id]);

  // Reset form data when vehicle changes
  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    }
  }, [vehicle]);

  const fetchVehicleData = async (id: number) => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/vehicles/${id}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch vehicle data: ${response.status} ${response.statusText}`
        );
      }

      // Add more robust JSON parsing with error handling
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        throw new Error("Invalid response format from server");
      }

      if (!data || !data.vehicle) {
        console.error("Unexpected response format:", data);
        throw new Error("Invalid data structure in response");
      }

      setFormData(data.vehicle);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      // You could show an error message to the user here
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    setIsLoading(true);
    try {
      onSave({ ...vehicle, ...formData });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving vehicle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูล</DialogTitle>
          <DialogDescription>
            แก้ไขรายละเอียดยานพาหนะกดบันทึกเมื่อเสร็จสิ้น
          </DialogDescription>
        </DialogHeader>
        {isFetching ? (
          <div className="py-8 text-center">กำลังโหลดข้อมูล...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="licensePlate">ทะเบียนรถ</Label>
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">ยี่ห้อ</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">ประเภทรถ</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">โมเดล</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="variant">รุ่น</Label>
                <Input
                  id="variant"
                  name="variant"
                  value={formData.variant || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">URL รูปภาพ</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  "กำลังบันทึก..."
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    บันทึก
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
