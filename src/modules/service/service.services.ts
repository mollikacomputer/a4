import { prisma } from "../../lib/prisma";
import {  IServiceInterface} from "./service.interface";


const createServiceFromDb = async (payload: IServiceInterface) => {
  const { technicianId, categoryId, description, price } = payload;

  // categoryId থেকে category খুঁজে বের করা হচ্ছে, যাতে তার name টাই title হিসেবে বসে
  const category = await prisma.serviceCategory.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Service category not found");
  }

  // একই টেকনিশিয়ানের একই ক্যাটাগরির অধীনে একই টাইটেলের (category name) সার্ভিস আছে কিনা চেক
  const isServiceExist = await prisma.service.findFirst({
    where: {
      categoryId,
      technicianId,
      title: category.name,
    },
  });

  if (isServiceExist) {
    throw new Error("This service already exists");
  }

  const result = await prisma.service.create({
    data: {
      technicianId,
      categoryId,
      title: category.name, // category এর name field থেকে auto বসছে
      description,
      price: Number(price),
    },
  });

  return result;
};

export const serviceServices = {
  createServiceFromDb,
};