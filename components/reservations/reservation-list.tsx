import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reservation } from "@/types/reservation";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useMemo } from "react";
import useSWR from "swr";
import ReservationCard from "./reservation-card";

interface ReservationListProps {
  date: Date;
}

const ReservationList = ({ date }: ReservationListProps) => {
  // Format date for display
  const formattedDate = format(date, "dd MMMM yyyy", { locale: th });

  // Use SWR to fetch and cache reservation data
  const { data, error, isLoading } = useSWR("/api/reservations");

  // Filter reservations for the selected date with useMemo for performance
  const filteredReservations = useMemo(() => {
    if (!data) return [];

    const selectedDateStr = format(date, "yyyy-MM-dd");
    return data.filter((reservation: Reservation) => {
      const reservationDate = reservation.date.split("T")[0];
      return reservationDate === selectedDateStr;
    });
  }, [data, date]);

  // Prepare error message if any
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : "Failed to load reservations"
    : null;

  return (
    <Card className="lg:col-span-2 bg-background">
      <CardHeader>
        <CardTitle>รายการจองวันที่ {formattedDate}</CardTitle>
        <CardDescription>แสดงรายละเอียดการจองทั้งหมด</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        ) : errorMessage ? (
          <div className="flex justify-center items-center py-8 text-red-500">
            <p>{errorMessage}</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">
              ไม่พบรายการจองสำหรับวันที่เลือก
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationList;
