"use client";

import ReservationCalendar from "@/components/reservations/reservation-calendar";
import { ReservationFormDialog } from "@/components/reservations/reservation-form-dialog";
import ReservationList from "@/components/reservations/reservation-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { SWRConfig } from "swr";

// Create a global fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
};

const ReservationsPage = () => {
  const [date, setDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use callback to handle reservation updates
  const handleReservationSuccess = useCallback(() => {
    // This will be handled by the ReservationList component which now uses SWR
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        dedupingInterval: 5000,
      }}
    >
      <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
              การจองรถ
            </h1>
            <p className="text-muted-foreground">ข้อมูลการจองรถทั้งหมด</p>
          </div>
          <Button
            size="lg"
            className="flex items-center gap-2 px-4 sm:px-6 w-full sm:w-auto justify-center"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusCircle className="h-5 w-5" />
            สร้างการจองใหม่
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <ReservationCalendar date={date} setDate={setDate} />

          {/* Reservations List */}
          <ReservationList date={date} />
        </div>

        {/* Reservation Form Dialog */}
        <ReservationFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleReservationSuccess}
        />
      </div>
    </SWRConfig>
  );
};

export default ReservationsPage;
