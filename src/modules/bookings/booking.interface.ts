// import { BookingStatus } from '@prisma/client';

import { BookingStatus } from "../../../generated/prisma/enums";

export type IBookingFilterRequest = {
  searchTerm?: string;
  customerId?: string;
  technicianId?: string;
  serviceId?: string;
  status?: BookingStatus;
  bookingDate?: string;
};

export type ICreateBookingPayload = {
  customerId: string;
  technicianId: string;
  serviceId: string;
  slotId?: string;
  bookingDate: Date | string;
  status?: BookingStatus;
};

export type IUpdateBookingPayload = Partial<{
  technicianId: string;
  serviceId: string;
  slotId: string | null;
  bookingDate: Date | string;
  status: BookingStatus;
}>;

export const bookingSearchableFields: string[] = [
  'customerId',
  'technicianId',
  'serviceId',
  'status',
];

export const bookingFilterableFields: string[] = [
  'searchTerm',
  'customerId',
  'technicianId',
  'serviceId',
  'status',
  'bookingDate',
];

export const bookingRelationalFields: string[] = [
  'customerId',
  'technicianId',
  'serviceId',
  'slotId',
];

export const bookingRelationalFieldsMapper: { [key: string]: string } = {
  customerId: 'customer',
  technicianId: 'technician',
  serviceId: 'service',
  slotId: 'slot',
};