import { UserRole } from "../../../generated/prisma/enums";

export interface IUpdateProfileInput {
  bio?: string;
  experienceYears?: number;
  hourlyRate?: number;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  // services?: Service[];
  // availabilitySlots?: AvailabilitySlot[];
}

export interface TechnicianProfileResponse {
  id: string;
  userId: string;
  bio: string | null;
  experienceYears: number;
  hourlyRate: number | null;
  isVerified: boolean;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
}