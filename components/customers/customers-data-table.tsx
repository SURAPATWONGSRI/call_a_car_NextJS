"use client";

import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils/date";
import { Customer } from "@/types/customers";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import * as React from "react";

interface CustomersDataTableProps {
  data: Customer[];
  isLoading?: boolean;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
}

const formatPhoneNumber = (phone: string): string => {
  // Handle empty or invalid phone numbers
  if (!phone || phone.length < 10) return phone;

  // Format as 0xx-xxx-xxxx
  return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
};

export function CustomersDataTable({
  data,
  isLoading = false,
  onEdit = () => {},
  onDelete = () => {},
}: CustomersDataTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortColumn, setSortColumn] = React.useState<keyof Customer | null>(
    null
  );
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [customerToDelete, setCustomerToDelete] =
    React.useState<Customer | null>(null);

  const itemsPerPage = 10;

  // Filter data based on search term (name filter)
  const filteredData = React.useMemo(() => {
    return data.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Sort data based on column
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage]);

  // Total pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle sort toggle
  const toggleSort = (column: keyof Customer) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle delete button click
  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (customerToDelete) {
      onDelete(customerToDelete.id);
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="w-full max-w-none">
      <div className="flex items-center py-4 w-full justify-between">
        <Input
          placeholder="Filter by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
          disabled={isLoading}
        />
      </div>
      <div className="rounded-md border w-full overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="whitespace-nowrap">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-accent-foreground"
                  onClick={() => toggleSort("id")}
                >
                  ID
                  <ArrowUpDown
                    className={`h-4 w-4 ${
                      sortColumn === "id"
                        ? "text-foreground"
                        : "text-muted-foreground/70"
                    }`}
                  />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap min-w-[200px]">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-accent-foreground"
                  onClick={() => toggleSort("name")}
                >
                  ชื่อลูกค้า
                  <ArrowUpDown
                    className={`h-4 w-4 ${
                      sortColumn === "name"
                        ? "text-foreground"
                        : "text-muted-foreground/70"
                    }`}
                  />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap min-w-[150px]">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-accent-foreground"
                  onClick={() => toggleSort("phone")}
                >
                  เบอร์โทรศัพท์
                  <ArrowUpDown
                    className={`h-4 w-4 ${
                      sortColumn === "phone"
                        ? "text-foreground"
                        : "text-muted-foreground/70"
                    }`}
                  />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap min-w-[180px]">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-accent-foreground"
                  onClick={() => toggleSort("createdAt")}
                >
                  วันที่เพิ่ม
                  <ArrowUpDown
                    className={`h-4 w-4 ${
                      sortColumn === "createdAt"
                        ? "text-foreground"
                        : "text-muted-foreground/70"
                    }`}
                  />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap min-w-[180px]">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-accent-foreground"
                  onClick={() => toggleSort("updatedAt")}
                >
                  วันที่แก้ไข
                  <ArrowUpDown
                    className={`h-4 w-4 ${
                      sortColumn === "updatedAt"
                        ? "text-foreground"
                        : "text-muted-foreground/70"
                    }`}
                  />
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap text-right">
                {""}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <span className="ml-2">กำลังโหลดข้อมูล...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{formatPhoneNumber(customer.phone)}</TableCell>
                  <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  <TableCell>{formatDate(customer.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(customer)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>แก้ไข</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(customer)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ลบ</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4 w-full">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {paginatedData.length} of {sortedData.length} entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="mx-2 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="ลบ"
        description={`คุณต้องการลบข้อมูล "${
          customerToDelete?.name || ""
        }" ใช่หรือไม่? `}
      />
    </div>
  );
}
