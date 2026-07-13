import httpStatus from "http-status";
import { CreateSlotInput, GetAvailableSlotsQuery } from "./slot.interface";
import { prisma } from "../../lib/prisma";

// ---------- Helpers ----------
const toTimeDate = (time: string): Date => {
  const normalized = time.length === 5 ? `${time}:00` : time;
  return new Date(`1970-01-01T${normalized}Z`);
};

const toDateOnly = (dateStr: string): Date => {
  return new Date(`${dateStr}T00:00:00Z`);
};

// only for admin create slot
const createSlot = async (userId: string, payload: CreateSlotInput) => {
  const { slotDate, startTime, endTime } = payload;

  if (!slotDate || !startTime || !endTime) {
    throw new Error(
      "slotDate, startTime, endTime সবগুলো ফিল্ড দিতে হবে।"
    );
  }

  const startDate = toTimeDate(startTime);
  const endDate = toTimeDate(endTime);

  if (startDate >= endDate) {
    throw new Error(
      "startTime অবশ্যই endTime এর আগে হতে হবে।"
    );
  }

  // লগইন করা ইউজারের সাথে যুক্ত টেকনিশিয়ান প্রোফাইল বের করা
  // (ধরে নেওয়া হচ্ছে TechnicianProfile.userId ফিল্ড User এর সাথে link করা)
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technician) {
    throw new Error(
      "আপনার একাউন্টের সাথে যুক্ত কোনো টেকনিশিয়ান প্রোফাইল পাওয়া যায়নি।"
    );
  }

  const technicianId = technician.id;

  // একই দিনে ওভারল্যাপিং স্লট আছে কিনা চেক
  const overlapping = await prisma.availabilitySlot.findFirst({
    where: {
      technicianId,
      slotDate: toDateOnly(slotDate),
      AND: [{ startTime: { lt: endDate } }, { endTime: { gt: startDate } }],
    },
  });

  if (overlapping) {
    throw new Error(
      "এই সময়ে টেকনিশিয়ানের একটি স্লট আগে থেকেই আছে (overlap)।"
    );
  }

  const result = await prisma.availabilitySlot.create({
    data: {
      technicianId,
      slotDate: toDateOnly(slotDate),
      startTime: startDate,
      endTime: endDate,
    },
  });

  return result;
};


const getAvailableSlots = async (query: GetAvailableSlotsQuery) => {
  const { technicianId, slotDate } = query;

  const result = await prisma.availabilitySlot.findMany({
    where: {
      isBooked: false,
      ...(technicianId && { technicianId }),
      ...(slotDate && { slotDate: toDateOnly(slotDate) }),
    },
    include: {
      technician: true,
    },
    orderBy: [{ slotDate: "asc" }, { startTime: "asc" }],
  });

  return result;
};

export const slotService = {
  createSlot,
  getAvailableSlots,
};