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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Driver } from "@/types/driver";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema for driver form validation
export const editDriverFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร" })
    .max(100, { message: "ชื่อต้องมีความยาวไม่เกิน 100 ตัวอักษร" }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก" })
    .optional()
    .or(z.literal("")),
  imageUrl: z
    .string()
    .url({ message: "URL ไม่ถูกต้อง" })
    .optional()
    .or(z.literal("")),
});

interface EditDriverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver | null;
  onSubmit: (
    values: z.infer<typeof editDriverFormSchema>,
    driverId: string
  ) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
}

export function EditDriverForm({
  open,
  onOpenChange,
  driver,
  onSubmit,
  isSubmitting,
}: EditDriverFormProps) {
  const form = useForm<z.infer<typeof editDriverFormSchema>>({
    resolver: zodResolver(editDriverFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      imageUrl: "",
    },
  });

  // Use useEffect to update form values when driver changes
  useEffect(() => {
    if (driver && open) {
      form.reset({
        name: driver.name,
        phone: driver.phone || "",
        imageUrl: driver.imageUrl || "",
      });
    }
  }, [driver, open, form]);

  async function handleSubmit(values: z.infer<typeof editDriverFormSchema>) {
    if (!driver) return;

    const result = await onSubmit(values, driver.id);

    if (result.success) {
      form.reset();
      onOpenChange(false);
    } else if (result.error) {
      form.setError("root", { message: result.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลคนขับรถ</DialogTitle>
          <DialogDescription>
            อัพเดทข้อมูลสำหรับคนขับรถ เมื่อทำเสร็จแล้วให้กดบันทึก
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ-นามสกุล</FormLabel>
                  <FormControl>
                    <Input placeholder="ชื่อคนขับรถ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรศัพท์</FormLabel>
                  <FormControl>
                    <Input placeholder="เบอร์โทรศัพท์" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL รูปภาพ</FormLabel>
                  <FormControl>
                    <Input placeholder="URL รูปภาพ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
