"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Driver } from "@/types/driver";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";

// Dummy data for demonstration
const initialDrivers: Driver[] = [
  {
    id: "1",
    name: "สมชาย ใจดี",
    licenseNumber: "12345678",
    phoneNumber: "0891234567",
    licenseType: "ประเภท 2",
    status: "active",
  },
  {
    id: "2",
    name: "สมหญิง รักดี",
    licenseNumber: "87654321",
    phoneNumber: "0891234568",
    licenseType: "ประเภท 3",
    status: "inactive",
  },
];

export function DriversDataTable() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);

  const handleDelete = (id: string) => {
    setDrivers(drivers.filter((driver) => driver.id !== id));
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="py-5 px-8 font-semibold text-sm">
              ชื่อ-นามสกุล
            </TableHead>
            <TableHead className="py-5 px-8 font-semibold text-sm">
              เบอร์โทรศัพท์
            </TableHead>
            <TableHead className="py-5 px-8 font-semibold text-sm">
              เลขที่ใบขับขี่
            </TableHead>
            <TableHead className="py-5 px-8 font-semibold text-sm">
              ประเภทใบขับขี่
            </TableHead>
            <TableHead className="py-5 px-8 font-semibold text-sm">
              สถานะ
            </TableHead>
            <TableHead className="py-5 px-8 w-[120px] text-right">
              จัดการ
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-gray-500"
              >
                ไม่พบข้อมูลคนขับรถ
              </TableCell>
            </TableRow>
          ) : (
            drivers.map((driver) => (
              <TableRow
                key={driver.id}
                className="hover:bg-gray-50/50 border-b last:border-0"
              >
                <TableCell className="py-5 px-8 font-medium">
                  {driver.name}
                </TableCell>
                <TableCell className="py-5 px-8">
                  {driver.phoneNumber}
                </TableCell>
                <TableCell className="py-5 px-8">
                  {driver.licenseNumber}
                </TableCell>
                <TableCell className="py-5 px-8">
                  {driver.licenseType}
                </TableCell>
                <TableCell className="py-5 px-8">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                      driver.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {driver.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                  </span>
                </TableCell>
                <TableCell className="py-5 px-8 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-9 w-9 p-0">
                        <span className="sr-only">เปิดเมนู</span>
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                        <Pencil className="h-4 w-4" />
                        แก้ไข
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                        onClick={() => handleDelete(driver.id)}
                      >
                        <Trash className="h-4 w-4" />
                        ลบ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
