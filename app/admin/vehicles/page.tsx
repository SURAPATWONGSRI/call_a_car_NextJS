"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const VehiclesPage = () => {
  return (
    <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
            ยานพาหนะ
          </h1>
          <p className="text-slate-500">จัดการข้อมูลยานพาหนะทั้งหมดในระบบ</p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto justify-center"
        >
          <PlusCircle className="h-5 w-5" />
          เพิ่มยานพาหนะ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl">รถยนต์ {i + 1}</CardTitle>
              <CardDescription>ทะเบียน กข-1234</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="aspect-video w-full bg-slate-100 rounded-md mb-4 flex items-center justify-center text-slate-400">
                รูปภาพ
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">ประเภท</span>
                  <span className="text-sm font-medium">รถเก๋ง</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">สถานะ</span>
                  <span className="text-sm font-medium text-green-600">
                    ว่าง
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehiclesPage;
