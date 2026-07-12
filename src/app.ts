import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors"
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import { auth } from "./middleware/auth";
import { UserRole } from "../generated/prisma/enums";
import { userRoutes } from "./modules/user/user.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { technicianRouter } from "./modules/technician/technician.route";

const app: Application = express();

app.use(cors({
        origin : config.app_url,
        credentials: true,
    }))

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get("/", (req:Request, res:Response)=>{
    res.send("Hello Assignment 4");
});


app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/technicians', technicianRouter);



app.use(notFound);
app.use(globalErrorHandler)

export default app;
