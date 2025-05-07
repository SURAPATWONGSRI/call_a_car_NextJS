export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  licenseType: string;
  status: "active" | "inactive";
}
