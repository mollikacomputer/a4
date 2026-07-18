import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    });

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: { userId: user.id }
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

const handleWebhook = async (payload: Buffer, signature: string) =>{

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