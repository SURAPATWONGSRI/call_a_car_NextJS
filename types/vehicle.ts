export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  type: string;
  model: string | null;
  variant: string | null;
  active: boolean;
  imageUrl?: string;
}
