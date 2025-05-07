"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, Calendar, Car, DollarSign, Users } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="w-full space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
          แผงควบคุม
        </h1>
        <p className="text-slate-500">ภาพรวมของระบบและข้อมูลสำคัญ</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="จำนวนการจอง"
          value="24"
          description="เพิ่มขึ้น 12% จากเดือนที่แล้ว"
          icon={Calendar}
        />
        <StatsCard
          title="ลูกค้าทั้งหมด"
          value="120"
          description="เพิ่มขึ้น 8% จากเดือนที่แล้ว"
          icon={Users}
        />
        <StatsCard
          title="ยานพาหนะ"
          value="18"
          description="มี 12 คันที่พร้อมใช้งาน"
          icon={Car}
        />
        <StatsCard
          title="รายได้"
          value="฿42,500"
          description="เพิ่มขึ้น 16% จากเดือนที่แล้ว"
          icon={DollarSign}
        />
      </div>

      {/* Charts and Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>การจองรายเดือน</CardTitle>
            <CardDescription>
              แนวโน้มการจองในช่วง 6 เดือนที่ผ่านมา
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-slate-50 rounded-md flex items-center justify-center text-slate-400">
              กราฟแสดงข้อมูลการจอง
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ยอดจองแบ่งตามประเภทรถ</CardTitle>
            <CardDescription>
              การกระจายตัวของการจองตามประเภทยานพาหนะ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-slate-50 rounded-md flex items-center justify-center text-slate-400">
              กราฟวงกลมแสดงสัดส่วน
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมล่าสุด</CardTitle>
          <CardDescription>การจองและการเปลี่ยนแปลงล่าสุดในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">การจองใหม่ #{1000 + i}</p>
                    <p className="text-sm text-slate-500">วันนี้, 10:0{i} น.</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-full">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 flex justify-center">
          <button className="text-sm text-primary hover:underline">
            ดูทั้งหมด
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, description, icon: Icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardPage;
