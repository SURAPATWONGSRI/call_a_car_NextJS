"use client";

import ReservationCalendar from "@/components/reservations/reservation-calendar";
import { ReservationFormDialog } from "@/components/reservations/reservation-form-dialog";
import ReservationList from "@/components/reservations/reservation-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

const ReservationsPage = () => {
  const [date, setDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger a refresh of the reservations list

  // Function to refresh the reservations list
  const refreshReservations = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
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
        <ReservationList date={date} key={refreshKey} />
      </div>

      {/* Reservation Form Dialog */}
      <ReservationFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={refreshReservations}
      />
    </div>
  );
};

export default ReservationsPage;
