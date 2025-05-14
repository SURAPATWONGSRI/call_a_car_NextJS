import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
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
}

const ReservationCalendar = ({ date, setDate }: ReservationCalendarProps) => {
  // Format the selected date for display
  const formattedDate = format(date, "EEEE dd MMMM yyyy", { locale: th });

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

      <CardContent>
        <div className="mb-4">
          <Badge variant="outline" className="text-sm py-1 px-3 bg-slate-50">
            {formattedDate}
          </Badge>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && setDate(d)}
          className="rounded-lg border shadow-sm mx-auto max-w-full"
          locale={th}
        />
      </CardContent>
    </Card>
  );
};

export default ReservationCalendar;
