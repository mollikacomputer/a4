import { Decimal } from "@prisma/client/runtime/client";



export interface IServiceInterface {
  technicianId?: string;
  categoryId: string;
  description?: string;
  price: Decimal | number | string;
}