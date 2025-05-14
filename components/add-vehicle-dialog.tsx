"use client";

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
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (vehicle: any) => void;
}

export function AddVehicleDialog({
  open,
  onOpenChange,
  onAdd,
}: AddVehicleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    licensePlate: "",
    brand: "",
    type: "",
    model: "",
    variant: "",
    imageUrl: "",
  });

  // Reset errors when dialog opens/closes
  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  // Check for duplicate license plate with debounce
  useEffect(() => {
    if (!formData.licensePlate) return;

    const checkLicensePlate = async () => {
      setIsChecking(true);
      try {
        const response = await fetch(
          `/api/vehicles/check?licensePlate=${encodeURIComponent(
            formData.licensePlate
          )}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (data.exists) {
          setErrors((prev) => ({
            ...prev,
            licensePlate: "ป้ายทะเบียนนี้มีในระบบแล้ว",
          }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.licensePlate;
            return newErrors;
          });
        }
      } catch (error) {
        console.error("Error checking license plate:", error);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkLicensePlate, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.licensePlate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate license plate
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = "กรุณาระบุป้ายทะเบียน";
    } else if (!/^[ก-ฮ0-9\s]{2,8}$/.test(formData.licensePlate.trim())) {
      newErrors.licensePlate = "รูปแบบป้ายทะเบียนไม่ถูกต้อง";
    }

    // Validate brand
    if (!formData.brand.trim()) {
      newErrors.brand = "กรุณาระบุยี่ห้อ";
    }

    // Validate type
    if (!formData.type.trim()) {
      newErrors.type = "กรุณาระบุประเภท";
    }

    // Validate model
    if (!formData.model.trim()) {
      newErrors.model = "กรุณาระบุโมเดล";
    }

    // Validate imageUrl if provided
    if (
      formData.imageUrl &&
      !formData.imageUrl.match(/^(http|https):\/\/[^\s$.?#].[^\s]*$/)
    ) {
      newErrors.imageUrl = "URL ไม่ถูกต้อง";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("กรุณาตรวจสอบข้อมูล", {
        description: "มีข้อมูลที่ไม่ถูกต้องหรือไม่ครบถ้วน",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for duplicate license plate one more time before submission
      const checkResponse = await fetch(
        `/api/vehicles/check?licensePlate=${encodeURIComponent(
          formData.licensePlate
        )}`,
        {
          method: "GET",
        }
      );

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setErrors((prev) => ({
          ...prev,
          licensePlate: "ป้ายทะเบียนนี้มีในระบบแล้ว",
        }));
        throw new Error("ป้ายทะเบียนนี้มีในระบบแล้ว");
      }

      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle error responses
        let errorMessage = `Failed to add vehicle (Status: ${response.status})`;
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
      onAdd(data.vehicle);
      toast("Vehicle added", {
        description: "The new vehicle has been added successfully.",
      });

      // Reset form and close dialog
      setFormData({
        licensePlate: "",
        brand: "",
        type: "",
        model: "",
        variant: "",
        imageUrl: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to add vehicle",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.licensePlate &&
    formData.brand &&
    formData.type &&
    formData.model;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>เพิ่มยานพาหนะใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลยานพาหนะที่ต้องการเพิ่มลงในระบบ
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="licensePlate" className="text-right">
                ป้ายทะเบียน *
              </Label>
              <div className="col-span-3">
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="กท 1234"
                  className={errors.licensePlate ? "border-red-500" : ""}
                  required
                />
                {errors.licensePlate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.licensePlate}
                  </p>
                )}
                {isChecking && (
                  <p className="text-gray-500 text-xs mt-1">
                    กำลังตรวจสอบป้ายทะเบียน...
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                ยี่ห้อ *
              </Label>
              <div className="col-span-3">
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Toyota"
                  className={errors.brand ? "border-red-500" : ""}
                  required
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                ประเภท *
              </Label>
              <div className="col-span-3">
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  placeholder="sedan"
                  onChange={handleChange}
                  className={errors.type ? "border-red-500" : ""}
                  required
                />
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                โมเดล *
              </Label>
              <div className="col-span-3">
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  placeholder="corolla altis"
                  onChange={handleChange}
                  className={errors.model ? "border-red-500" : ""}
                  required
                />
                {errors.model && (
                  <p className="text-red-500 text-xs mt-1">{errors.model}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="variant" className="text-right">
                รุ่น
              </Label>
              <Input
                id="variant"
                name="variant"
                value={formData.variant}
                onChange={handleChange}
                placeholder="HEV GR Sport"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                URL รูปภาพ
              </Label>
              <div className="col-span-3">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={errors.imageUrl ? "border-red-500" : ""}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && (
                  <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>
                )}
              </div>
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
              disabled={isSubmitting || isChecking || !isFormValid}
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
