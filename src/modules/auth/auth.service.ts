import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILogginUser } from "./auth.interface";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { RegisterUserPayload } from "../user/user.interface";


const loginUser= async(payload: ILogginUser)=>{
    const {email, password} = payload;
    const user = await prisma.user.findFirstOrThrow({
        where:{email}
    })
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if(!isPasswordMatch){
        throw new Error("Password is incorrect");
    }
    const jwtPayload ={
        id: user.id,
        name: user.name,
        email: user.email,
        role:user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    )

    return {
        accessToken,
        refreshToken
    };
};

const refreshToken = async(refreshToken:string)=>{
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if(!verifiedRefreshToken.success){
        throw new Error(verifiedRefreshToken.error)
    }

    const {id} = verifiedRefreshToken.data as JwtPayload;
    console.log("for refresh token ID", id)

    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id
        }
    })

    if(user.status === "BANNED"){
        throw new Error("User is Blocked!")
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )
    return {accessToken};
}

const registerUserIntoDb = async(payload:RegisterUserPayload) =>{

    const {name, email, password, profilePhoto, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where : {email}
});
if(isUserExist){
    throw new Error("User with this email already exists") 
}

const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data:{
            name,
            email,
            password : hashedPassword,
            role,
            profile:{
                create:{
                    profilePhoto
                }
            }
            
        }
    });

const user = await prisma.user.findUnique({
    where:{
        id: createdUser.id,
        email: createdUser.email || email
    },
    omit:{
        password:true
    },
    include:{
        profile:true
    }
})
return user;
}


const getMyProfileIntoDB = async (userId: string) =>{
    const user = await prisma.user.findUniqueOrThrow({
        where: {id:userId},
        omit:{
            password:true
        },
        include:{
            profile:true
        }
    });
    return user;
};


export const authService = {
    loginUser,
    refreshToken,
    registerUserIntoDb,
    getMyProfileIntoDB,
}