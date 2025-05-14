"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Import utility libraries
import { Driver } from "@/types/driver";
import { Vehicle } from "@/types/vehicle";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Define form schema for validation
const formSchema = z.object({
  reservedByName: z.string().min(2, "ชื่อผู้จองต้องมีอย่างน้อย 2 ตัวอักษร"),
  date: z.date({
    required_error: "กรุณาเลือกวันที่",
  }),
  timeStart: z.string().min(1, "กรุณาระบุเวลาเริ่มต้น"),
  timeEnd: z.string().min(1, "กรุณาระบุเวลาสิ้นสุด"),
  purpose: z.string().default(""),
  pickupLocation: z.string().min(1, "กรุณาระบุสถานที่รับ"),
  dropoffLocation: z.string().min(1, "กรุณาระบุสถานที่ส่ง"),
  passengerCount: z.number().optional().default(0),
  passengerInfo: z.string().default(""),
  customerId: z.string().default("none"),
  vehicleId: z.string().default("none"),
  driverId: z.string().default("none"),
});

type FormValues = z.infer<typeof formSchema>;

interface ReservationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ReservationFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: ReservationFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);

  // Functions to display selected vehicle and driver names
  const getVehicleDisplayName = (vehicleId: string) => {
    if (vehicleId === "none") return "ไม่ระบุ";
    // Convert to string for comparison since IDs might be coming as numbers
    const vehicle = vehicles.find((v) => String(v.id) === String(vehicleId));
    // Remove debug logging in production
    if (!vehicle) return "เลือกรถ";
    return `${vehicle.brand || ""} ${vehicle.model || ""} (${
      vehicle.licensePlate || ""
    })`;
  };

  const getDriverDisplayName = (driverId: string) => {
    if (driverId === "none") return "ไม่ระบุ";
    // Convert to string for comparison since IDs might be coming as numbers
    const driver = drivers.find((d) => String(d.id) === String(driverId));
    if (!driver) return "เลือกคนขับ";
    const driverPhone = driver.phone ? ` (${driver.phone})` : "";
    return `${driver.name || ""}${driverPhone}`;
  };

  // Customer handling
  const [customers, setCustomers] = useState<
    { id: string; name: string; phone?: string }[]
  >([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const getCustomerDisplayName = (customerId: string) => {
    if (customerId === "none") return "ไม่ระบุ";
    // Convert to string for comparison since IDs might be coming as numbers
    const customer = customers.find((c) => String(c.id) === String(customerId));
    if (!customer) return "เลือกลูกค้า";
    const customerPhone = customer.phone ? ` (${customer.phone})` : "";
    return `${customer.name || ""}${customerPhone}`;
  };

  // Initialize form with default values
  const form = useForm<FormValues>({
    defaultValues: {
      vehicleId: "none",
      driverId: "none",
      customerId: "none",
      reservedByName: "",
      pickupLocation: "",
      dropoffLocation: "",
      purpose: "",
      passengerInfo: "",
      passengerCount: 0,
      timeStart: "",
      timeEnd: "",
    },
  });

  // Fetch vehicles, drivers, and customers when dialog opens
  useEffect(() => {
    if (open) {
      fetchVehicles();
      fetchDrivers();
      fetchCustomers();

      // Reset form to default values when dialog opens
      form.reset({
        vehicleId: "none",
        driverId: "none",
        customerId: "none",
        reservedByName: "",
        pickupLocation: "",
        dropoffLocation: "",
        purpose: "",
        passengerInfo: "",
        passengerCount: 0,
        timeStart: "",
        timeEnd: "",
      });
    }
  }, [open, form]);

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      setIsLoadingVehicles(true);
      const response = await fetch("/api/vehicles");
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถโหลดข้อมูลรถได้",
      });
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  // Fetch drivers from API
  const fetchDrivers = async () => {
    try {
      setIsLoadingDrivers(true);
      const response = await fetch("/api/drivers");
      if (!response.ok) {
        throw new Error("Failed to fetch drivers");
      }
      const data = await response.json();
      setDrivers(data || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถโหลดข้อมูลคนขับได้",
      });
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setIsLoadingCustomers(true);
      const response = await fetch("/api/customers");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถโหลดข้อมูลลูกค้าได้",
      });
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      // Prepare passenger info to be a JSON string if needed
      let passengerInfoData = null;
      if (data.passengerInfo) {
        try {
          // Check if it's already valid JSON
          JSON.parse(data.passengerInfo);
          passengerInfoData = data.passengerInfo;
        } catch {
          // If not, assume it's a simple string and create a simple array
          passengerInfoData = JSON.stringify([
            { name: data.passengerInfo, phone: "" },
          ]);
        }
      }

      // Format the date to ISO string for the API
      const formattedDate = data.date.toISOString();

      // Transform values before sending to API
      const vehicleId = data.vehicleId === "none" ? null : data.vehicleId;
      const driverId = data.driverId === "none" ? null : data.driverId;
      const customerId = data.customerId === "none" ? null : data.customerId;

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          vehicleId,
          driverId,
          customerId,
          date: formattedDate,
          passengerInfo: passengerInfoData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      toast("สร้างการจองสำเร็จ", {
        description: "ข้อมูลการจองได้ถูกบันทึกเรียบร้อยแล้ว",
      });

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);

      // Trigger callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast("เกิดข้อผิดพลาด", {
        description:
          error instanceof Error ? error.message : "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>สร้างการจองใหม่</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลเพื่อสร้างรายการจองรถใหม่ในระบบ
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ข้อมูลผู้จอง */}
              <FormField
                control={form.control}
                name="reservedByName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อผู้จอง</FormLabel>
                    <FormControl>
                      <Input placeholder="ระบุชื่อผู้จอง" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* วันที่ */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>วันที่จอง</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: th })
                            ) : (
                              <span>เลือกวันที่</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={th}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* เวลาเริ่มต้น */}
              <FormField
                control={form.control}
                name="timeStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เวลาเริ่มต้น</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* เวลาสิ้นสุด */}
              <FormField
                control={form.control}
                name="timeEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เวลาสิ้นสุด</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* เลือกรถ */}
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => {
                  // Ensure we have the correct field value for vehicle
                  const vehicleValue = field.value || "none";
                  return (
                    <FormItem>
                      <FormLabel>รถ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={vehicleValue}
                        defaultValue="none"
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              isLoadingVehicles &&
                                "opacity-70 cursor-not-allowed"
                            )}
                          >
                            <SelectValue>
                              {isLoadingVehicles
                                ? "กำลังโหลดข้อมูลรถ..."
                                : getVehicleDisplayName(vehicleValue)}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">ไม่ระบุ</SelectItem>
                          {vehicles
                            .filter((vehicle) => vehicle.id)
                            .map((vehicle) => (
                              <SelectItem
                                key={vehicle.id}
                                value={String(vehicle.id)}
                              >
                                {vehicle.brand} {vehicle.model} (
                                {vehicle.licensePlate})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* เลือกคนขับ */}
              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => {
                  // Ensure we have the correct field value for driver
                  const driverValue = field.value || "none";
                  return (
                    <FormItem>
                      <FormLabel>คนขับ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={driverValue}
                        defaultValue="none"
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              isLoadingDrivers &&
                                "opacity-70 cursor-not-allowed"
                            )}
                          >
                            <SelectValue>
                              {isLoadingDrivers
                                ? "กำลังโหลดข้อมูลคนขับ..."
                                : getDriverDisplayName(driverValue)}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">ไม่ระบุ</SelectItem>
                          {drivers
                            .filter((driver) => driver.id)
                            .map((driver) => (
                              <SelectItem
                                key={driver.id}
                                value={String(driver.id)}
                              >
                                {driver.name}{" "}
                                {driver.phone && `(${driver.phone})`}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* เลือกลูกค้า */}
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => {
                  // Ensure we have the correct field value for customer
                  const customerValue = field.value || "none";
                  return (
                    <FormItem>
                      <FormLabel>ลูกค้า</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={customerValue}
                        defaultValue="none"
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              isLoadingCustomers &&
                                "opacity-70 cursor-not-allowed"
                            )}
                          >
                            <SelectValue>
                              {isLoadingCustomers
                                ? "กำลังโหลดข้อมูลลูกค้า..."
                                : getCustomerDisplayName(customerValue)}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">ไม่ระบุ</SelectItem>
                          {customers
                            .filter((customer) => customer.id)
                            .map((customer) => (
                              <SelectItem
                                key={customer.id}
                                value={String(customer.id)}
                              >
                                {customer.name}{" "}
                                {customer.phone && `(${customer.phone})`}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* สถานที่รับ */}
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สถานที่รับ</FormLabel>
                    <FormControl>
                      <Input placeholder="ระบุสถานที่รับ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* สถานที่ส่ง */}
              <FormField
                control={form.control}
                name="dropoffLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สถานที่ส่ง</FormLabel>
                    <FormControl>
                      <Input placeholder="ระบุสถานที่ส่ง" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* จำนวนผู้โดยสาร */}
              <FormField
                control={form.control}
                name="passengerCount"
                render={({ field: { onChange, value, ...restField } }) => (
                  <FormItem>
                    <FormLabel>จำนวนผู้โดยสาร</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ระบุจำนวนคน"
                        onChange={(e) => {
                          const val =
                            e.target.value === "" ? 0 : Number(e.target.value);
                          onChange(val);
                        }}
                        value={value === 0 ? "" : value}
                        {...restField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>{" "}
            {/* วัตถุประสงค์ */}
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>วัตถุประสงค์</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ระบุวัตถุประสงค์ในการเดินทาง"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            {/* รายชื่อผู้โดยสาร */}
            <FormField
              control={form.control}
              name="passengerInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รายชื่อผู้โดยสาร</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ระบุรายชื่อผู้โดยสาร เช่น นายสมชาย (081-234-5678)"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                บันทึกข้อมูล
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
