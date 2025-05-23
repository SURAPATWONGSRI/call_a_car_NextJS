"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils/date";
import { Driver } from "@/types/driver";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Format Thai phone number: 0xxxxxxxxxx -> 0xx-xxx-xxxx
const formatPhoneNumber = (phone: string): string => {
  // Handle empty or invalid phone numbers
  if (!phone || phone.length < 10) return phone;

  // Format as 0xx-xxx-xxxx
  return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
};

interface DriversDataTableProps {
  drivers: Driver[];
  loading: boolean;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
}

export function DriversDataTable({
  drivers: initialDrivers,
  loading,
  onEdit,
  onDelete,
}: DriversDataTableProps) {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Use useEffect to update drivers when props change to avoid infinite render
  useEffect(() => {
    if (!loading) {
      setDrivers(initialDrivers);
    }
  }, [initialDrivers, loading]);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sortedDrivers = [...drivers].sort((a, b) => {
      // Map column names to match database fields
      const dbColumn =
        column === "created_at"
          ? "createdAt"
          : column === "updated_at"
          ? "updatedAt"
          : column;

      const aValue = a[dbColumn as keyof Driver];
      const bValue = b[dbColumn as keyof Driver];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return 0;
      }
    });

    setDrivers(sortedDrivers);
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[100px] ">รูปภาพ</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  ชื่อ-นามสกุล
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>เบอร์โทรศัพท์</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center">
                  วันที่เพิ่ม
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>วันที่แก้ไข</TableHead>
              <TableHead className="w-[150px] text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  กำลังโหลดข้อมูล...
                </TableCell>
              </TableRow>
            ) : drivers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลคนขับรถ
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow
                  key={driver.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{driver.id}</TableCell>
                  <TableCell>
                    {driver.imageUrl ? (
                      <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                        <img
                          src={driver.imageUrl}
                          alt={`${driver.name}'s profile`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        <span className="text-xs text-muted-foreground">
                          ไม่มีรูป
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{formatPhoneNumber(driver.phone)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{formatDate(driver.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{formatDate(driver.updatedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-md border-muted-foreground/20"
                              onClick={() => onEdit(driver)}
                            >
                              <span className="sr-only">แก้ไข</span>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>แก้ไข</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-md border-destructive/30"
                              onClick={() => onDelete(driver)}
                            >
                              <span className="sr-only">ลบ</span>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ลบ</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
