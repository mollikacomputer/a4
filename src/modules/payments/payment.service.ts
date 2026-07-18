import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (userId: string, bookingId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
    });

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: { bookingId, userId: user.id },
        });
        stripeCustomerId = customer.id;

        await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customer.id },
        });
    }

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: config.stripe_product_price_id,
                quantity: 1,
            },
        ],
        mode: "subscription",
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        success_url: `${config.app_url}/payment?success=true`,
        cancel_url: `${config.app_url}/payment?success=false`,
        // ✅ bookingId ও userId দুটোই metadata তে রাখা হলো, webhook-এ দরকার হবে
        metadata: { userId: user.id, bookingId },
    });

    return { paymentUrl: session.url };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.stripe_webhook_secret;

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret,
    );

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;

            const userId = session.metadata?.userId;
            const bookingId = session.metadata?.bookingId;
            const stripeCustomerId = session.customer as string;
            const stripeSubscriptionId = session.subscription as string;

            if (!userId || !bookingId || !stripeSubscriptionId || !stripeCustomerId) {
                throw new Error("Webhook Failed: missing required fields");
            }

            const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

            const currentPeriodEndInMs = stripeSubscription.items.data[0]?.current_period_end!;
            const currentPeriodEnd = new Date(currentPeriodEndInMs * 1000);

            const amount = session.amount_total ? session.amount_total / 100 : 0;

            await prisma.payment.upsert({
                where: {
                    userId,
                },
                create: {
                    userId,
                    bookingId,
                    amount,
                    paymentMethod: "STRIPE",
                    stripeCustomerId,
                    stripeSubscriptionId,
                    currentPeriodEnd,
                    status: "PAID",
                    paidAt: new Date(),
                },
                update: {
                    stripeCustomerId,
                    stripeSubscriptionId,
                    currentPeriodEnd,
                    status: "PAID",
                    paidAt: new Date(),
                },
            });

            break;
        }

        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            const stripeSubscriptionId = subscription.id;

            const currentPeriodEndInMs = subscription.items.data[0]?.current_period_end!;
            const currentPeriodEnd = new Date(currentPeriodEndInMs * 1000);

            // Stripe status → আপনার PaymentStatus enum এ ম্যাপ করুন
            const status = mapStripeStatusToPaymentStatus(subscription.status);

            await prisma.payment.updateMany({
                where: { stripeSubscriptionId },
                data: {
                    status,
                    currentPeriodEnd,
                },
            });

            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const stripeSubscriptionId = subscription.id;

            await prisma.payment.updateMany({
                where: { stripeSubscriptionId },
                data: {
                    status: "PENDING", // আপনার PaymentStatus enum এ এই ভ্যালু আছে কিনা চেক করুন
                },
            });

            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
            break;
    }
};

  

// Stripe subscription status কে আপনার PaymentStatus enum এ ম্যাপ করার হেল্পার
function mapStripeStatusToPaymentStatus(
    stripeStatus: Stripe.Subscription.Status
): "PAID" | "PENDING" | "FAILED" | "REFUNDED" {
    switch (stripeStatus) {
        case "active":
        case "trialing":
            return "PAID";

        case "past_due":
        case "incomplete":
            return "PENDING";

        case "canceled":
        case "unpaid":
        case "incomplete_expired":
            return "FAILED";

        default:
            return "FAILED";
    }
}

export const paymentService = {
    createCheckoutSession,
    handleWebhook,
};


// import Stripe from "stripe";
// import config from "../../config";
// import { prisma } from "../../lib/prisma";
// import { stripe } from "../../lib/stripe";


// const createCheckoutSession = async (userId: string, bookingId:string) => {
//     const user = await prisma.user.findUniqueOrThrow({
//         where: { id: userId }
//     });

//     let stripeCustomerId = user.stripeCustomerId;

//     if (!stripeCustomerId) {
//         const customer = await stripe.customers.create({
//             email: user.email,
//             name: user.name,
//             metadata: {bookingId, userId: user.id }
//         });
//         stripeCustomerId = customer.id;

//         await prisma.user.update({
//             where: { id: userId },
//             data: { stripeCustomerId: customer.id }
//         });
//     }

//     const session = await stripe.checkout.sessions.create({
//         line_items: [
//             {
//                 price: config.stripe_product_price_id,
//                 quantity: 1
//             }
//         ],
//         mode: "subscription",
//         customer: stripeCustomerId,
//         payment_method_types: ["card"],
//         success_url: `${config.app_url}/payment?success=true`,
//         cancel_url: `${config.app_url}/payment?success=false`,
//         metadata: { userId: user.id }
//     });

//     return { paymentUrl: session.url };
// };

// const handleWebhook = async (payload: Buffer, signature: string, bookingId: string) =>{

//     const endpointSecret = config.stripe_webhook_secret

//     const event = stripe.webhooks.constructEvent(
//         payload,
//         signature,
//         endpointSecret,
//     );

//     // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':

//     console.log(event.data.object);
//     const session: Stripe.Checkout.Session = event.data.object;
//     const userId = session.metadata?.userId
//     const stripeCustomerId = session.customer as string
//     const stripeSubscriptionId = session.subscription as string;

//     if(!userId || !stripeSubscriptionId || !stripeCustomerId){
//         throw new Error("Webhook Failed")
//     }

//     const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

//     console.log("sub info :", stripeSubscription.items.data[0]);
//     const currentPeriodStartInMiliSecond = stripeSubscription.items.data[0]?.current_period_start!;
//     const currentPeriodStart = new Date(currentPeriodStartInMiliSecond * 1000);

//     const currentPeriodEndtInMiliSecond = stripeSubscription.items.data[0]?.current_period_end!;
//     const currentPeriodEnd = new Date(currentPeriodEndtInMiliSecond * 1000);

//     console.log(currentPeriodEnd, "end====================")
//     const amount = session.amount_total ? session.amount_total / 100 : 0;
//     await prisma.payment.upsert({
//         where:{
//             userId
//         },
//         create:{
//         userId,
//         bookingId,
//         amount,
//         paymentMethod: "STRIPE",
//         stripeCustomerId,
//         stripeSubscriptionId,
//         currentPeriodEnd,
//         },
//         update:{
//             stripeCustomerId,
//         stripeSubscriptionId,
//         currentPeriodEnd,
//         status: "PAID",
//         paidAt: new Date(),
//         }
//     })
    
//     console.log(event.data.object);
//       break;
//     case 'customer.subscription.updated':
      

//       break;

//       case 'customer.subscription.deleted':
//       break;
//     default:
//       // Unexpected event type
//       console.log(` NO event matched Unhandled event type ${event.type}.`);
//       break;
//   }
// }
// export const paymentService = {
//     createCheckoutSession,
//     handleWebhook
// }