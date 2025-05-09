import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export type VehicleCardProps = Vehicle & {
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: number) => void;
};

export const VehicleCard = ({
  id,
  licensePlate,
  brand,
  type,
  model,
  variant,
  imageUrl,
  onEdit,
  onDelete,
}: VehicleCardProps) => {
  return (
    <Card className="overflow-hidden h-[650px] flex flex-col">
      <CardHeader className="p-4 pt-2 md:p-4">
        <CardTitle className="text-xl truncate">
          {brand} {model || ""} {variant || ""}
        </CardTitle>
        <CardDescription className="truncate">
          ทะเบียน {licensePlate}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 flex-grow flex flex-col">
        {imageUrl ? (
          <div className="aspect-video w-full rounded-md mb-4 overflow-hidden h-[200px] flex items-center justify-center">
            <Image
              src={imageUrl}
              width={400}
              height={400}
              alt={`${brand}-${type}`}
              className="object-cover "
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-muted rounded-md mb-4 flex items-center justify-center text-muted-foreground h-[200px]">
            รูปภาพ
          </div>
        )}
        <div className="space-y-2 flex-grow">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">ยี่ห้อ</span>
            <span className="text-sm font-medium">{brand}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">ทะเบียนรถ</span>
            <span className="text-sm font-medium">{licensePlate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">ประเภทรถ</span>
            <span className="text-sm font-medium capitalize">{type}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">โมเดล</span>
            <span className="text-sm font-medium">{model}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">รุ่น</span>
            <span className="text-sm font-medium">{variant}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-2 flex justify-between ">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onEdit?.({
              id,
              licensePlate,
              brand,
              type,
              model,
              variant,
              imageUrl,
              active: true,
              // timestamp fields จะถูกจัดการโดยฐานข้อมูล
            })
          }
          className="w-[48%]"
        >
          <Edit className="h-4 w-4 mr-2" />
          แก้ไข
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete?.(id)}
          className="w-[48%] border-destructive/30 hover:bg-destructive/30"
        >
          <Trash2 className="h-4 w-4 mr-2 text-destructive" />
          <p className="text-destructive">ลบ</p>
        </Button>
      </CardFooter>
    </Card>
  );
};
