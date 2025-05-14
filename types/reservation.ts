export interface Reservation {
  id: string;
  customerId: string;
  reservedByName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: string;
  purpose?: string | null;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;
  vehicleId?: string | null;
  driverId?: string | null;
  passengerCount?: number | null;
  passengerInfo?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  vehicle?: {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
  } | null;
  driver?: {
    id: string;
    name: string;
  } | null;
  customer?: {
    id: string;
    name: string;
    phone?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
  } | null;
}
