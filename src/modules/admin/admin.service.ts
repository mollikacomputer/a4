import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { IServiceCategory } from "./admin.interface";

const getAllUsersFromDB = async() =>{
    const result = await prisma.user.findMany()

    return result;
}

const createCategoryIntoDb = async (payload: IServiceCategory) => {

    console.log("Payload name-----:",payload)

    const {name, description} = payload;


      const isCategoryExist = await prisma.serviceCategory.findUnique({
        where : {name}
    });

    if(isCategoryExist){
    throw new Error("This Category already exists") 
    }

  const result = await prisma.serviceCategory.create({
    data: {
      name,
      description,
    },
  });
  return result;

};

const getCategoriesFronDb = async() =>{
    const result = await prisma.serviceCategory.findMany();

    return result;
}


const updateUserStatus = async (
  userId: string,
  authorId: string,
  isAdmin: boolean,
  status: UserStatus,
) => {
  if (!isAdmin && userId !== authorId) {
    throw new Error("You are not the owner of this account");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { status },
    omit: {
    password: true,
  },
  });

  return result;
};

export const adminService = {
    getAllUsersFromDB,
    createCategoryIntoDb,
    getCategoriesFronDb,
    updateUserStatus,
}