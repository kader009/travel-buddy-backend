import { Context } from '../../types/context';

export const paymentResolver = {
  createPaymentIntent: async (
    parent: unknown,
    { planType }: { planType: string },
    { userId }: Context,
  ) => {
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // In a real application, you would integrate Stripe/SSLCommerz here
    // e.g. const paymentIntent = await stripe.paymentIntents.create({ amount: 1000, currency: 'usd' });
    // return paymentIntent.client_secret;

    // For now, we mock the payment intent secret
    return 'mock_client_secret_' + Math.random().toString(36).substring(7);
  },

  verifyPayment: async (
    parent: unknown,
    { transactionId, planType }: { transactionId: string; planType: string },
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', subscription: null };
    }

    try {
      // In a real application, verify the transaction with your payment gateway first

      const existingSub = await prisma.subscription.findUnique({
        where: { userId },
      });

      let subscription;
      if (existingSub) {
        subscription = await prisma.subscription.update({
          where: { userId },
          data: {
            planType,
            status: 'active',
            transactionId,
          },
        });
      } else {
        subscription = await prisma.subscription.create({
          data: {
            userId,
            planType,
            status: 'active',
            transactionId,
          },
        });
      }

      // Update user to verified
      await prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      });

      return { userError: null, subscription };
    } catch (error: any) {
      return { userError: error.message, subscription: null };
    }
  },
};
