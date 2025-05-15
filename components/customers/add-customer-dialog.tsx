"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Create schema for customer form validation
const customerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร" })
    .max(100, { message: "ชื่อต้องมีความยาวไม่เกิน 100 ตัวอักษร" }),
  phone: z
    .string()
    .min(10, { message: "เบอร์โทรศัพท์ต้องมีความยาวอย่างน้อย 10 ตัวอักษร" })
    .max(10, { message: "เบอร์โทรศัพท์ต้องมีความยาวไม่เกิน 10 ตัวอักษร" })
    .regex(/^[0-9]+$/, { message: "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น" })
    .optional()
    .or(z.literal("")),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface AddCustomerDialogProps {
  onCustomerAdded: () => void;
}

export function AddCustomerDialog({ onCustomerAdded }: AddCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  async function onSubmit(data: CustomerFormValues) {
    try {
      setIsSubmitting(true);
      setShowError(false);

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone || undefined, // Send undefined if empty string
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.error || "ไม่สามารถเพิ่มลูกค้าได้ กรุณาลองใหม่อีกครั้ง"
        );
        setShowError(true);
        return;
      }

      toast.success("เพิ่มลูกค้าสำเร็จ", {
        description: `เพิ่มลูกค้า ${data.name} สำเร็จแล้ว`,
      });

      form.reset();
      setOpen(false);

      onCustomerAdded();
    } catch (error) {
      console.error("Error adding customer:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ไม่สามารถเพิ่มลูกค้าได้ กรุณาลองใหม่อีกครั้ง"
      );
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-1 " size={"lg"}>
            <PlusCircle className="h-4 w-4" />
            เพิ่มลูกค้า
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>เพิ่มลูกค้าใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลลูกค้าที่ต้องการเพิ่ม
            </DialogDescription>
          </DialogHeader>

          {showError && (
            <Alert variant="destructive">
              <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อลูกค้า *</FormLabel>
                    <FormControl>
                      <Input placeholder="กรอกชื่อลูกค้า" {...field} />
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
                      <Input placeholder="กรอกเบอร์โทรศัพท์" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
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
    </>
  );
}
