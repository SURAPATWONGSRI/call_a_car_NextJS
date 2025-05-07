"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

const ReservationsPage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
            การจองรถ
          </h1>
          <p className="text-slate-500">จัดการข้อมูลการจองรถทั้งหมดในระบบ</p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto justify-center"
        >
          <PlusCircle className="h-5 w-5" />
          สร้างการจองใหม่
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>ปฏิทินการจอง</CardTitle>
            <CardDescription>เลือกวันเพื่อดูรายละเอียดการจอง</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              className="rounded-md border mx-auto max-w-full"
            />
          </CardContent>
        </Card>

        {/* Reservations List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              รายการจองวันที่ {date.toLocaleDateString("th-TH")}
            </CardTitle>
            <CardDescription>แสดงรายละเอียดการจองทั้งหมด</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-lg">
                        การจอง #{1000 + i}
                      </h3>
                      <p className="text-sm text-slate-500">
                        ลูกค้า: คุณสมชาย ใจดี
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ยืนยันแล้ว
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">รถที่จอง</p>
                      <p className="font-medium">Toyota Camry (กข-1234)</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">คนขับ</p>
                      <p className="font-medium">นายสมหมาย รักขับ</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">เวลารับรถ</p>
                      <p className="font-medium">09:00 น.</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">เวลาคืนรถ</p>
                      <p className="font-medium">18:00 น.</p>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      รายละเอียด
                    </Button>
                    <Button variant="outline" size="sm">
                      แก้ไข
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReservationsPage;
