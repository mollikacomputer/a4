import { prisma } from "../../lib/prisma"
import { IUpdateProfileInput } from "./technician.interface";

// const getTechnicians = async() =>{
//   const result = await prisma.technicianProfile.findMany()

//   return result;
// }
// ১স্টেপ
// const getTechnicians = async () => {
//   const result = await prisma.technicianProfile.findMany({
//     include: {
//       user: {
//         select: {
//           name: true,
//           email: true,
//           role: true,
//         },
//       },
//     },
//   });

//   return result;
// };

// ২য় স্টেপ user info first print
const getTechnicians = async () => {
  const result = await prisma.user.findMany({
    where: { role: "TECHNICIAN" },   // আপনার role enum/ভ্যালু অনুযায়ী বসান
    select: {
      name: true,
      email: true,
      role: true,
      technicianProfile: true,
    },
  });

  return result;
};

const updateTechnicianProfile = async (userId:string, payload:IUpdateProfileInput) => {

const {bio, address, experienceYears, hourlyRate,city,latitude,longitude} = payload;
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: {
    technicianProfile: {
      upsert: {
        create: { bio, address, experienceYears, hourlyRate, city, latitude, longitude},
        update: { bio, address, experienceYears, hourlyRate, city, latitude, longitude },
      },
    },
  },
  omit: { password: true },
  include: { technicianProfile: true },
});
    return updatedUser;
};

export const technicianService = {
    getTechnicians,
    updateTechnicianProfile
}