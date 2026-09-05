import Stripe from 'stripe';
import { PaymentAdapter, ChargeRequest, PaymentResult, RefundResult, WebhookEvent } from './adapter';

export class StripeAdapter implements PaymentAdapter {
  private stripe: Stripe;

  constructor(secretKey: string, private webhookSecret: string) {
    this.stripe = new Stripe(secretKey, { apiVersion: '2024-04-10' });
  }

  async charge(request: ChargeRequest): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(request.amount * 100),
        currency: request.currency.toLowerCase(),
        payment_method: request.paymentMethodId,
        confirm: true,
        metadata: request.metadata,
      });

      if (paymentIntent.status === 'succeeded') {
        return { success: true, transactionId: paymentIntent.id };
      }
      return { success: false, error: paymentIntent.last_payment_error?.message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async refund(transactionId: string, amount?: number): Promise<RefundResult> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: transactionId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
      return { success: true, refundId: refund.id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  verifyWebhook(payload: string, signature: string): WebhookEvent | null {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
      
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const pi = event.data.object as Stripe.PaymentIntent;
          return {
            type: 'payment.succeeded',
            transactionId: pi.id,
            metadata: pi.metadata,
          };
        }
        case 'payment_intent.payment_failed': {
          const pi = event.data.object as Stripe.PaymentIntent;
          return {
            type: 'payment.failed',
            transactionId: pi.id,
            error: pi.last_payment_error?.message ?? 'Unknown error',
          };
        }
        case 'charge.refunded': {
          const charge = event.data.object as Stripe.Charge;
          return { type: 'refund.succeeded', refundId: charge.id };
        }
        default:
          return null;
      }
    } catch {
      return null;
    }
  }
}