import { Booking, BookingStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateBookingPayload } from "./booking.interface";

const createBooking = async (
  customerId: string,
  payload: ICreateBookingPayload
): Promise<Booking> => {
  const customer = await prisma.user.findUnique({
    where: { id: customerId },
  });
  if (!customer) {
    throw new Error('Customer not found');
  }

  const technician = await prisma.user.findUnique({
    where: { id: payload.technicianId },
  });
  if (!technician) {
    throw new Error('Technician not found');
  }
  if (technician.role !== 'TECHNICIAN') {
    throw new Error('প্রদত্ত id টি কোনো টেকনিশিয়ানের নয়।');
  }

  const service = await prisma.service.findUnique({
    where: { id: payload.serviceId },
  });
  if (!service) {
    throw new Error('Service not found');
  }

  if (payload.slotId) {
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: payload.slotId },
    });
    if (!slot) {
      throw new Error('Availability slot not found');
    }
  }

  const result = await prisma.booking.create({
    data: {
      customerId,
      technicianId: payload.technicianId,
      serviceId: payload.serviceId,
      slotId: payload.slotId,
      bookingDate: new Date(payload.bookingDate),
      status: payload.status ?? BookingStatus.PENDING,
    },
    include: {
      customer: true,
      technician: true,
      service: true,
      slot: true,
    },
  });

  return result;
};

export const bookingService = {
  createBooking,
};



// import { Booking, BookingStatus } from "../../../generated/prisma/client";
// import { prisma } from "../../lib/prisma";
// import { ICreateBookingPayload } from "./booking.interface";

// const createBooking = async (
//   payload: ICreateBookingPayload
// ): Promise<Booking> => {
//   const customer = await prisma.user.findUnique({
//     where: { id: payload.customerId },
//   });
//   if (!customer) {
//     throw new Error('Customer not found');
//   }

//   // ✅ technicianId কে User টেবিলে চেক করা হচ্ছে, TechnicianProfile এ না
//   const technician = await prisma.user.findUnique({
//     where: { id: payload.technicianId },
//   });
//   if (!technician) {
//     throw new Error('Technician not found');
//   }
//   if (technician.role !== 'TECHNICIAN') {
//     throw new Error('প্রদত্ত id টি কোনো টেকনিশিয়ানের নয়।');
//   }

//   const service = await prisma.service.findUnique({
//     where: { id: payload.serviceId },
//   });
//   if (!service) {
//     throw new Error('Service not found');
//   }

//   if (payload.slotId) {
//     const slot = await prisma.availabilitySlot.findUnique({
//       where: { id: payload.slotId },
//     });
//     if (!slot) {
//       throw new Error('Availability slot not found');
//     }
//   }

//   const result = await prisma.booking.create({
//     data: {
//       customerId: payload.customerId,
//       technicianId: payload.technicianId,
//       serviceId: payload.serviceId,
//       slotId: payload.slotId,
//       bookingDate: new Date(payload.bookingDate),
//       status: payload.status ?? BookingStatus.PENDING,
//     },
//     include: {
//       customer: true,
//       technician: true,
//       service: true,
//       slot: true,
//     },
//   });

//   return result;
// };

// export const bookingService ={
//   createBooking
// }