"use client";

import { AddCustomerDialog } from "@/components/customers/add-customer-dialog";
import { CustomersDataTable } from "@/components/customers/customers-data-table";
import { EditCustomerDialog } from "@/components/customers/edit-customer-dialog";
import { Customer } from "@/types/customers";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

// Create a fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
};

const CustomersPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  // Use SWR for data fetching with caching
  const {
    data: customers = [],
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR("/api/customers", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000, // Avoid refetching the same data within 10 seconds
  });

  const error = fetchError
    ? "ไม่สามารถดึงข้อมูลลูกค้าได้ กรุณาลองอีกครั้ง"
    : null;

  const handleCustomerAdded = () => {
    mutate();
  };

  const handleCustomerUpdated = () => {
    mutate();
  };

  const handleEditCustomer = (customer: Customer) => {
    router.push(`/admin/customers?edit=${customer.id}`, { scroll: false });
  };

  const handleDeleteCustomer = useCallback(
    async (customerId: string) => {
      try {
        const response = await fetch(`/api/customers/${customerId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        toast.success("ลบข้อมูลลูกค้าสำเร็จ", {
          description: `ข้อมูลได้ถูกลบเรียบร้อยแล้ว`,
        });

        mutate(); // Revalidate data after deletion
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการลบข้อมูลลูกค้า", {
          description: "กรุณาลองอีกครั้ง",
        });
        console.error("Failed to delete customer:", err);
      }
    },
    [mutate]
  );

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
