import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface ReservationCalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  highlightedDates?: Date[]; // Dates that have reservations
}

const ReservationCalendar = ({
  date,
  setDate,
  highlightedDates = [],
}: ReservationCalendarProps) => {
  // Format the selected date for display
  const formattedDate = format(date, "EEEE dd MMMM yyyy", { locale: th });

  // Custom modifiers for the calendar
  const modifiers = {
    highlighted: highlightedDates,
  };

  // Custom day rendering to show indicators for dates with reservations
  const modifiersStyles = {
    highlighted: {
      backgroundColor: "rgba(var(--primary), 0.1)",
      fontWeight: "bold",
    },
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>ปฏิทินการจอง</CardTitle>
            <CardDescription>เลือกวันเพื่อดูรายละเอียดการจอง</CardDescription>
          </div>
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <Calendar
        mode="single"
        selected={date}
        onSelect={(d) => d && setDate(d)}
        className="rounded-lg border mx-auto max-w-full"
        locale={th}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        components={{
          DayContent: ({ date }) => {
            // Check if this date has reservations
            const hasReservations = highlightedDates.some(
              (d) =>
                d.getDate() === date.getDate() &&
                d.getMonth() === date.getMonth() &&
                d.getFullYear() === date.getFullYear()
            );

            return (
              <div className="relative w-full h-full flex items-center justify-center">
                <span>{date.getDate()}</span>
                {hasReservations && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"></div>
                )}
              </div>
            );
          },
        }}
      />
    </Card>
  );
};

export default ReservationCalendar;
