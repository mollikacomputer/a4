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

// app.post('/api/payments/webhook', express.raw({type:'application/json'}), (request, response)=>{
//     let event = request.body;
//     console.log(event,"event before try catch block --------------------")
//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = request.headers['stripe-signature']!;
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.body,
//         signature,
//         endpointSecret
//       );
//     } catch (err: any) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return response.status(400).json({
//         message:err.message
//       });
//     }
//         console.log(event,"event afteter try catch block --------------------")
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// })

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
