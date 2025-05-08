export interface Vehicle {
  id: number;
  licensePlate: string;
  brand: string;
  type: string;
  model: string | null;
  variant: string | null;
  active: boolean;
  imageUrl?: string;
}
