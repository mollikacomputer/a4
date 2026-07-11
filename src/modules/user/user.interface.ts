import { UserRole } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    phone?:string;
    profilePhoto?: string;
    role?:UserRole;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole
  // add other fields matching your Prisma schema
}