import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors"
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { technicianRouter } from "./modules/technician/technician.route";
import { serviceRoute } from "./modules/service/service.route";
import { slotRouter } from "./modules/slot/slot.routes";
import { bookingRoutes} from "./modules/bookings/booking.route";
import { reviewRouter } from "./modules/reviews/review.route";
import { paymentRouter } from "./modules/payments/payment.routes";
import { stripe } from "./lib/stripe";

const app: Application = express();

app.use(cors({
        origin : config.app_url,
        credentials: true,
    }))

    const endpointSecret = config.stripe_webhook_secret;
app.use('/api/payments/webhook', express.raw({type:'application/json'}))
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
app.use('/api/service', serviceRoute);
app.use('/api/slot', slotRouter);
app.use('/api/booking', bookingRoutes);
app.use('/api/reviews', reviewRouter);
app.use('/api/payments', paymentRouter );



app.use(notFound);
app.use(globalErrorHandler)

export default app;
