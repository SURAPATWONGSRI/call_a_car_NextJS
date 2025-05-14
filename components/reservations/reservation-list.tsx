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
import { useEffect, useState } from "react";
import ReservationCard from "./reservation-card";

interface ReservationListProps {
  date: Date;
}

const ReservationList = ({ date }: ReservationListProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format date for display
  const formattedDate = format(date, "dd MMMM yyyy", { locale: th });

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/reservations");

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Filter reservations for the selected date
        // This assumes the date from API is in ISO format
        const selectedDateStr = format(date, "yyyy-MM-dd");
        const filteredReservations = data.filter((reservation: Reservation) => {
          const reservationDate = reservation.date.split("T")[0];
          return reservationDate === selectedDateStr;
        });

        setReservations(filteredReservations);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load reservations"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [date]);

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
            <p>{error}</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">
              ไม่พบรายการจองสำหรับวันที่เลือก
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationList;
