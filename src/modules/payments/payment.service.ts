import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { subscribe } from "node:diagnostics_channel";

const createCheckoutSession = async (userId: string, bookingId:string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    });

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: {bookingId, userId: user.id }
        });
        stripeCustomerId = customer.id;

        await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customer.id }
        });
    }

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: config.stripe_product_price_id,
                quantity: 1
            }
        ],
        mode: "subscription",
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        success_url: `${config.app_url}/payment?success=true`,
        cancel_url: `${config.app_url}/payment?success=false`,
        metadata: { userId: user.id }
    });

    return { paymentUrl: session.url };
};

const handleWebhook = async (payload: Buffer, signature: string, bookingId: string) =>{

    const endpointSecret = config.stripe_webhook_secret

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret,
    );

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':

    console.log(event.data.object);
    const session: Stripe.Checkout.Session = event.data.object;
    const userId = session.metadata?.userId
    const stripeCustomerId = session.customer as string
    const stripeSubscriptionId = session.subscription as string;

    if(!userId || !stripeSubscriptionId || !stripeCustomerId){
        throw new Error("Webhook Failed")
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

    console.log("sub info :", stripeSubscription.items.data[0]);
    const currentPeriodStartInMiliSecond = stripeSubscription.items.data[0]?.current_period_start!;
    const currentPeriodStart = new Date(currentPeriodStartInMiliSecond * 1000);

    const currentPeriodEndtInMiliSecond = stripeSubscription.items.data[0]?.current_period_end!;
    const currentPeriodEnd = new Date(currentPeriodEndtInMiliSecond * 1000);

    console.log(currentPeriodEnd, "end====================")
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    await prisma.payment.upsert({
        where:{
            userId
        },
        create:{
        userId,
        bookingId,
        amount,
        paymentMethod: "STRIPE",
        stripeCustomerId,
        stripeSubscriptionId,
        currentPeriodEnd,
        },
        update:{
            stripeCustomerId,
        stripeSubscriptionId,
        currentPeriodEnd,
        status: "PAID",
        paidAt: new Date(),
        }
    })
    
    console.log(event.data.object);
      break;
    case 'customer.subscription.updated':
      

      break;

      case 'customer.subscription.deleted':
      break;
    default:
      // Unexpected event type
      console.log(` NO event matched Unhandled event type ${event.type}.`);
      break;
  }
}
export const paymentService = {
    createCheckoutSession,
    handleWebhook
}