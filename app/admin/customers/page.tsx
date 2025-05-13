"use client";

import { AddCustomerDialog } from "@/components/customers/add-customer-dialog";
import { CustomersDataTable } from "@/components/customers/customers-data-table";
import { EditCustomerDialog } from "@/components/customers/edit-customer-dialog";
import { Customer } from "@/types/customers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CustomersPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/customers");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("ไม่สามารถดึงข้อมูลลูกค้าได้ กรุณาลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCustomerAdded = () => {
    fetchCustomers();
  };

  const handleCustomerUpdated = () => {
    fetchCustomers();
  };

  const handleEditCustomer = (customer: Customer) => {
    router.push(`/admin/customers?edit=${customer.id}`, { scroll: false });
  };

  const handleDeleteCustomer = async (customerId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Show success toast notification
      toast.success("ลบข้อมูลลูกค้าสำเร็จ", {
        description: `ข้อมูลได้ถูกลบเรียบร้อยแล้ว`,
      });

      // Refresh the customer list after successful deletion
      fetchCustomers();
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูลลูกค้า", {
        description: "กรุณาลองอีกครั้ง",
      });
      console.error("Failed to delete customer:", err);
      setError("ไม่สามารถลบข้อมูลลูกค้าได้ กรุณาลองอีกครั้ง");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            ลูกค้า
          </h1>
          <p className="text-muted-foreground mt-1">
            จัดการข้อมูลลูกค้าทั้งหมดในระบบ
          </p>
        </div>
        <AddCustomerDialog onCustomerAdded={handleCustomerAdded} />
      </div>

      <div className="p-6">
        {error ? (
          <div className="text-center p-4 text-destructive">{error}</div>
        ) : (
          <CustomersDataTable
            data={customers}
            isLoading={isLoading}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        )}
      </div>

      <EditCustomerDialog onCustomerUpdated={handleCustomerUpdated} />
    </div>
  );
};

export default CustomersPage;
