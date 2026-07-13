
import httpStatus from 'http-status';

import {
  ICreateBookingPayload,
  IUpdateBookingPayload,
  IBookingFilterRequest,
  bookingSearchableFields,
} from './booking.interface';
import { Booking, BookingStatus, Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createBooking = async (
  payload: ICreateBookingPayload
): Promise<Booking> => {
  // ensure referenced records exist
  const customer = await prisma.user.findUnique({
    where: { id: payload.customerId },
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

  const service = await prisma.service.findUnique({
    where: { id: payload.serviceId },
  });
  if (!service) {
    throw new Error( 'Service not found');
  }

  if (payload.slotId) {
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: payload.slotId },
    });
    if (!slot) {
      throw new Error( 'Availability slot not found');
    }
  }

  const result = await prisma.booking.create({
    data: {
      customerId: payload.customerId,
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

const getAllBookings = async (
  filters: IBookingFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Booking[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, bookingDate, ...filterData } = filters;

  const andConditions: Prisma.BookingWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: bookingSearchableFields.map(field => ({
        [field]: {
          equals: searchTerm,
        },
      })),
    });
  }

  if (bookingDate) {
    andConditions.push({
      bookingDate: new Date(bookingDate),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: (filterData as Record<string, unknown>)[key],
      })),
    });
  }

  const whereConditions: Prisma.BookingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : { createdAt: 'desc' },
    include: {
      customer: true,
      technician: true,
      service: true,
      slot: true,
      payment: true,
      review: true,
    },
  });

  const total = await prisma.booking.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleBooking = async (id: string): Promise<Booking | null> => {
  const result = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      technician: true,
      service: true,
      slot: true,
      payment: true,
      review: true,
    },
  });

  if (!result) {
    throw new Error( 'Booking not found');
  }

  return result;
};

const updateBooking = async (
  id: string,
  payload: IUpdateBookingPayload
): Promise<Booking> => {
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    throw new Error( 'Booking not found');
  }

  const result = await prisma.booking.update({
    where: { id },
    data: {
      ...payload,
      bookingDate: payload.bookingDate
        ? new Date(payload.bookingDate)
        : undefined,
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

const updateBookingStatus = async (
  id: string,
  status: BookingStatus
): Promise<Booking> => {
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    throw new Error( 'Booking not found');
  }

  const result = await prisma.booking.update({
    where: { id },
    data: { status },
  });

  return result;
};

const deleteBooking = async (id: string): Promise<Booking> => {
  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    throw new Error( 'Booking not found');
  }

  const result = await prisma.booking.delete({
    where: { id },
  });

  return result;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
};