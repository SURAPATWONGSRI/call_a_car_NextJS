import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { Reservation } from "@/types/reservation";

interface ReservationCardProps {
  reservation: Reservation;
  onStatusChange?: (reservation: Reservation) => void;
}

const ReservationCard = ({
  reservation,
  onStatusChange,
}: ReservationCardProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { mutate } = useSWRConfig(); // Get the mutate function from SWR

  // Format the vehicle display string
  const vehicleDisplay = reservation.vehicle
    ? `${reservation.vehicle.brand || ""} ${reservation.vehicle.model || ""} (${
        reservation.vehicle.licensePlate || ""
      })`
    : "ไม่ระบุ";

  const imgDriverDisplay = reservation.driver
    ? reservation.driver.imageUrl
    : null;

  const driverDisplay = reservation.driver
    ? reservation.driver.name
    : "ไม่ระบุ";

  // Format status - default to "รอยืนยัน" if not provided
  const status = reservation.status || "รอยืนยัน";

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    // Format the phone number as needed
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  // Format date to display as DD/MM/YYYY
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "ไม่ระบุ";

    try {
      // Parse the date string (expected format: YYYY-MM-DD)
      const [year, month, day] = dateString.split("-");

      // Format as DD/MM/YYYY
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original if formatting fails
    }
  };

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ยืนยันแล้ว":
      case "confirmed":
      case "success":
        return "bg-green-100 text-green-800";
      case "รอยืนยัน":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "ยกเลิก":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Parse passenger info if available
  let passengerInfoList: Array<{ name: string; phone: string }> = [];
  try {
    if (reservation.passengerInfo) {
      passengerInfoList = JSON.parse(reservation.passengerInfo);
    }
  } catch (e) {
    console.error("Failed to parse passenger info:", e);
  }

  const statusColor = getStatusColor(status);

  // Function to update reservation status - optimized version
  const updateReservationStatus = useCallback(
    async (newStatus: string) => {
      if (!reservation.id) return;

      const isConfirmAction = newStatus === "confirmed";

      if (isConfirmAction) {
        setIsConfirming(true);
      } else {
        setIsCancelling(true);
      }

      try {
        // Create the request data
        const requestData = { status: newStatus };

        // Send the update request
        const response = await fetch(`/api/reservations/${reservation.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        // Handle non-OK responses
        if (!response.ok) {
          throw new Error(
            `Update failed: Server returned ${response.status} ${response.statusText}`
          );
        }

        // Update the local state directly
        const updatedReservation = {
          ...reservation,
          status: newStatus,
        };

        // Show success toast
        toast.success(`อัพเดท`, {
          description: `อัพเดทสถานะเป็น "${newStatus}" สำเร็จ`,
        });

        if (onStatusChange) {
          // Call the callback if provided
          onStatusChange(updatedReservation);
        }

        // Revalidate SWR cache for both the specific reservation and the list of reservations
        mutate(`/api/reservations/${reservation.id}`);
        mutate("/api/reservations"); // This revalidates the main reservations list
      } catch (error) {
        // Log and display error
        console.error("Error updating reservation status:", error);
        toast.error("เกิดข้อผิดพลาด", {
          description:
            error instanceof Error ? error.message : "ไม่สามารถอัพเดทสถานะได้",
        });
      } finally {
        if (isConfirmAction) {
          setIsConfirming(false);
        } else {
          setIsCancelling(false);
        }
      }
    },
    [reservation, onStatusChange, mutate]
  );

  // Handle confirm button click
  const handleConfirm = useCallback(() => {
    updateReservationStatus("confirmed");
  }, [updateReservationStatus]);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    updateReservationStatus("cancelled");
  }, [updateReservationStatus]);

  return (
    <div className="border bg-background rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">เลขที่จอง #{reservation.id}</h3>
          <p className="text-xs text-primary font-semibold mt-2">
            ชื่อคนจอง: {reservation.reservedByName}
          </p>

          {reservation.customer?.name && (
            <p className="text-xs text-muted-foreground">
              ชื่อลูกค้า: {reservation.customer.name}
              {reservation.customer?.phone &&
                ` (${formatPhoneNumber(reservation.customer.phone)})`}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            วันที่จอง:{" "}
            {reservation.date ? formatDateDisplay(reservation.date) : "ไม่ระบุ"}
          </p>
        </div>
        <div className="mt-2 sm:mt-0">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">รถ</div>
          <div className="rounded-md  p-2 text-sm flex items-center">
            {vehicleDisplay || "ไม่ระบุ"}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">คนขับ</div>
          <div className="rounded-md p-2 text-sm flex items-center">
            {imgDriverDisplay && (
              <img
                src={imgDriverDisplay}
                alt="Driver"
                className="w-8 h-8 rounded-lg mr-2 object-cover"
              />
            )}
            {driverDisplay}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">
            ขาไป (Go)
          </div>
          <div className="rounded-md  p-2 text-sm">
            <div className="flex items-center">
              <span className="font-medium mr-1">เวลา:</span>{" "}
              <span className="text-primary">
                {reservation.timeStart || "-"}
              </span>
            </div>
            {reservation.pickupLocation && (
              <div className="flex items-center mt-1">
                <span className="font-medium mr-1">ที่:</span>{" "}
                <span className="text-sm">{reservation.pickupLocation}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">
            ขากลับ (Back)
          </div>
          <div className="rounded-md  p-2 text-sm">
            <div className="flex items-center">
              <span className="font-medium mr-1">เวลา:</span>{" "}
              <span className="text-primary">{reservation.timeEnd || "-"}</span>
            </div>
            {reservation.dropoffLocation && (
              <div className="flex items-center mt-1 ">
                <span className="font-medium mr-1">ที่:</span>{" "}
                <span className=" text-sm">{reservation.dropoffLocation}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {(reservation.pickupLocation || reservation.dropoffLocation) && (
        <div className="mt-3 border-t pt-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-2">
              {reservation.pickupLocation && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    จุดรับ
                  </p>
                  <p className="text-sm">{reservation.pickupLocation}</p>
                </div>
              )}
              {reservation.dropoffLocation && (
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    จุดส่ง
                  </p>
                  <p className="text-sm">{reservation.dropoffLocation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {reservation.purpose && (
        <div className="mt-3 border-t pt-3">
          <p className="text-sm text-muted-foreground">วัตถุประสงค์</p>
          <p className="font-medium">{reservation.purpose}</p>
        </div>
      )}

      {(reservation.passengerCount || passengerInfoList.length > 0) && (
        <div className="mt-3 border-t pt-3">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              {reservation.passengerCount && (
                <p className="text-sm">
                  <span className="text-muted-foreground">จำนวนผู้โดยสาร:</span>{" "}
                  {reservation.passengerCount} คน
                </p>
              )}

              {passengerInfoList.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">
                    รายชื่อผู้โดยสาร:
                  </p>
                  <ul className="list-disc list-inside text-sm pl-1 space-y-1">
                    {passengerInfoList.map((passenger, idx) => (
                      <li key={idx}>
                        {passenger.name}{" "}
                        {passenger.phone && `- ${passenger.phone}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 border-t pt-4 flex flex-wrap gap-2">
        {status.toLowerCase() !== "ยืนยันแล้ว" &&
          status.toLowerCase() !== "success" &&
          status.toLowerCase() !== "confirmed" && (
            <Button
              variant="default"
              size="lg"
              onClick={handleConfirm}
              disabled={isConfirming || isCancelling}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังยืนยัน...
                </>
              ) : (
                "ยืนยัน"
              )}
            </Button>
          )}
        {status.toLowerCase() !== "ยกเลิก" &&
          status.toLowerCase() !== "cancelled" && (
            <Button
              variant="destructive"
              size="lg"
              onClick={handleCancel}
              disabled={isConfirming || isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังยกเลิก...
                </>
              ) : (
                "ยกเลิก"
              )}
            </Button>
          )}
      </div>
    </div>
  );
};

export default ReservationCard;
