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
import { useCallback, useMemo } from "react";
import useSWR from "swr";
import ReservationCard from "./reservation-card";

interface ReservationListProps {
  date: Date;
}

const ReservationList = ({ date }: ReservationListProps) => {
  // Format date for display
  const formattedDate = format(date, "dd MMMM yyyy", { locale: th });
  const selectedDateStr = format(date, "yyyy-MM-dd");

  // Use SWR to fetch and cache data
  const { data, error, isLoading, mutate } = useSWR("/api/reservations");

  // Filter reservations for the selected date
  const filteredReservations = useMemo(() => {
    if (!data) return [];

    return data.filter((reservation: Reservation) => {
      const reservationDate = reservation.date.split("T")[0];
      return reservationDate === selectedDateStr;
    });
  }, [data, selectedDateStr]);

  // Handle reservation status changes
  const handleStatusChange = useCallback(
    (updatedReservation: Reservation) => {
      // Update the local data immediately for a responsive UI
      if (!data) return;

      const updatedData = data.map((item: Reservation) =>
        item.id === updatedReservation.id ? updatedReservation : item
      );

      // Update the cached data without revalidation
      mutate(updatedData, false);

      // Then revalidate after a short delay (optimistic update pattern)
      setTimeout(() => mutate(), 2000);
    },
    [data, mutate]
  );

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
        ) : error ? (
          <div className="flex justify-center items-center py-8 text-red-500">
            <p>
              {error instanceof Error
                ? error.message
                : "เกิดข้อผิดพลาดในการโหลดข้อมูล"}
            </p>
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
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationList;
