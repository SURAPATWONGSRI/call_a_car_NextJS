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
import { Customer } from "@/types/customers";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อลูกค้า"),
  phone: z.string().min(1, "กรุณากรอกเบอร์โทรศัพท์").trim(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface EditCustomerDialogProps {
  onCustomerUpdated: () => void;
}

export function EditCustomerDialog({
  onCustomerUpdated,
}: EditCustomerDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Fetch customer data when dialog is opened
  useEffect(() => {
    if (editId) {
      setOpen(true);
      fetchCustomer(editId);
    } else {
      setOpen(false);
      setCustomer(null);
      setFormData({ name: "", phone: "" });
    }
  }, [editId]);

  const fetchCustomer = async (id: string) => {
    try {
      const response = await fetch(`/api/customers/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCustomer(data);
      setFormData({
        name: data.name,
        phone: data.phone || "",
      });
    } catch (error) {
      console.error("Failed to fetch customer:", error);
      toast.error("ไม่สามารถดึงข้อมูลลูกค้าได้");
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    try {
      // Validate form data
      const validatedData = customerSchema.parse(formData);
      setErrors({});

      setIsLoading(true);
      try {
        const response = await fetch(`/api/customers/${customer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validatedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        toast.success("อัปเดตข้อมูลลูกค้าสำเร็จ");
        onCustomerUpdated();
        handleClose();
      } catch (error) {
        console.error("Failed to update customer:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "ไม่สามารถอัปเดตข้อมูลลูกค้าได้"
        );
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Transform Zod errors into a simple object
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error("ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    router.push("/admin/customers", { scroll: false });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลลูกค้า</DialogTitle>
          <DialogDescription>
            แก้ไขรายละเอียดข้อมูลลูกค้า กรุณากรอกข้อมูลให้ครบถ้วน
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                ชื่อ
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                เบอร์โทรศัพท์
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
