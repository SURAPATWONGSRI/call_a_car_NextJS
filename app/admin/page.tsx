"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Car, Clock, Users } from "lucide-react";
import Link from "next/link";

const AdminHomePage = () => {
  // Quick stats data
  const quickStats = [
    {
      title: "การจองวันนี้",
      value: "8",
      icon: CalendarIcon,
      color: "bg-blue-100 text-blue-700",
      link: "/admin/reservations",
    },
    {
      title: "ลูกค้าใหม่",
      value: "12",
      icon: Users,
      color: "bg-green-100 text-green-700",
      link: "/admin/customers",
    },
    {
      title: "รถที่ว่าง",
      value: "15",
      icon: Car,
      color: "bg-amber-100 text-amber-700",
      link: "/admin/vehicles",
    },
    {
      title: "การจองล่าสุด",
      value: "5 นาทีที่แล้ว",
      icon: Clock,
      color: "bg-purple-100 text-purple-700",
      link: "/admin/reservations",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "เพิ่มการจองใหม่",
      link: "/admin/reservations",
      color: "bg-primary/80",
      bgClass:
        "bg-[url('https://s.yimg.com/ny/api/res/1.2/5jWvh2e0o3q798pwNZU1ew--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM2MA--/https://media.zenfs.com/en/gobankingrates_644/6fc737d7d92e6395b2a0c58997fe82d3')]",
    },
    {
      title: "เพิ่มลูกค้าใหม่",
      link: "/admin/customers",
      color: "bg-blue-600/80",
      bgClass:
        "bg-[url('https://www.zandxcars.com/wp-content/uploads/2022/06/girls.car_.smiling.jpg')]",
    },
    {
      title: "เพิ่มคนขับรถ",
      link: "/admin/drivers",
      color: "bg-emerald-600/80",
      bgClass:
        "bg-[url('https://rahahome.com/wp-content/uploads/2022/11/2-min-scaled.jpg')]",
    },
    {
      title: "เพิ่มยานพาหนะ",
      link: "/admin/vehicles",
      color: "bg-amber-600/80",
      bgClass:
        "bg-[url('https://t3.ftcdn.net/jpg/03/30/86/68/360_F_330866818_Roxy8uGcMahMVont2KrYNJEI41w91LWJ.jpg')]",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
          ยินดีต้อนรับ, wakim
        </h1>
        <p className="text-muted-foreground">ภาพรวมของระบบบริหารจัดการรถเช่า</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Link href={stat.link} key={index}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-xl font-semibold mb-4">เมนู (Menu)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link href={action.link} key={index}>
              <Card
                className={`cursor-pointer hover:opacity-90 transition-opacity overflow-hidden relative h-[160px]`}
              >
                {/* Apply background image with improved sizing and positioning */}
                <div
                  className={`absolute inset-0 ${action.bgClass} bg-cover bg-center bg-no-repeat`}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                ></div>

                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/60"></div>

                {/* Content */}
                <CardContent className="p-6 flex items-center justify-center h-full relative z-10">
                  <span className="text-2xl font-black text-white drop-shadow-md">
                    {action.title}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมล่าสุด</CardTitle>
          <CardDescription>การดำเนินการล่าสุดในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-lg"
              >
                <div
                  className={`p-2 rounded-full ${
                    [
                      "bg-blue-100 text-blue-700",
                      "bg-green-100 text-green-700",
                      "bg-amber-100 text-amber-700",
                    ][index % 3]
                  }`}
                >
                  {
                    [
                      <CalendarIcon key="cal" className="h-4 w-4" />,
                      <Users key="users" className="h-4 w-4" />,
                      <Car key="car" className="h-4 w-4" />,
                    ][index % 3]
                  }
                </div>
                <div>
                  <p className="font-medium">
                    {
                      [
                        "มีการจองใหม่",
                        "ลูกค้าใหม่ลงทะเบียน",
                        "มีการเพิ่มรถใหม่",
                        "มีการยกเลิกการจอง",
                        "มีการอัปเดตข้อมูลลูกค้า",
                      ][index]
                    }
                  </p>
                  <p className="text-sm text-slate-500">
                    {5 - index} นาทีที่แล้ว
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">ดูทั้งหมด</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHomePage;
