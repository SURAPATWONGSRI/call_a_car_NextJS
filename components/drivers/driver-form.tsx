"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Zod schema that matches our Driver type
export const driverFormSchema = z.object({
  name: z.string().min(1, { message: "ชื่อห้ามเป็นค่าว่าง" }),
  phone: z
    .string()
    .min(10, { message: "เบอร์โทรศัพท์ไม่ครบถ้วน" })
    .max(10, { message: "เบอร์โทรศัพท์ต้องไม่เกิน 10 ตัว" })
    .optional()
    .or(z.literal("")),
  imageUrl: z
    .string()
    .url({ message: "ต้องเป็น URL ที่ถูกต้อง" })
    .optional()
    .nullable(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

interface DriverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    values: DriverFormValues
  ) => Promise<{ success: boolean; error?: string; data?: Driver }>;
  onSuccess?: (driver: Driver) => void;
  isSubmitting?: boolean;
}

export function DriverForm({
  open,
  onOpenChange,
  onSubmit,
  onSuccess,
  isSubmitting = false,
}: DriverFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      imageUrl: null,
    },
  });

  async function handleSubmit(values: DriverFormValues) {
    setApiError(null);

    const result = await onSubmit(values);

    if (!result.success) {
      setApiError(result.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      return;
    }
    if (onSuccess && result.data) {
      onSuccess(result.data);
    }

    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>เพิ่มคนขับรถใหม่</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลคนขับรถใหม่ที่ต้องการเพิ่มในระบบ
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ-นามสกุล</FormLabel>
                  <FormControl>
                    <Input placeholder="ชื่อ-นามสกุลคนขับรถ" {...field} />
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
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value || null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
