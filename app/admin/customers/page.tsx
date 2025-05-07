"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";

const CustomersPage = () => {
  return (
    <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
            ลูกค้า
          </h1>
          <p className="text-slate-500">จัดการข้อมูลลูกค้าทั้งหมดในระบบ</p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto justify-center"
        >
          <PlusCircle className="h-5 w-5" />
          เพิ่มลูกค้าใหม่
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input placeholder="ค้นหาลูกค้า..." className="pl-9 w-full" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">กรองข้อมูล</Button>
              <Button variant="outline">ส่งออก</Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">รหัส</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead className="hidden sm:table-cell">อีเมล</TableHead>
                <TableHead className="hidden md:table-cell">เบอร์โทร</TableHead>
                <TableHead className="hidden lg:table-cell">
                  วันที่สมัคร
                </TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">#C{1000 + i}</TableCell>
                  <TableCell>คุณสมชาย ใจดี {i + 1}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    customer{i + 1}@example.com
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    080-123-456{i}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    01/0{i + 1}/2025
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        แก้ไข
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        ลบ
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="py-4 px-4 border-t flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-slate-500">แสดง 1-10 จาก 100 รายการ</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              ก่อนหน้า
            </Button>
            <Button variant="outline" size="sm">
              ถัดไป
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomersPage;
