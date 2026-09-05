import { Router, Request, Response } from 'express';
import { OrderService } from '../domain/order-service';
import { PaymentAdapter } from '../payments/adapter';

export function createOrderRouter(orderService: OrderService): Router {
  const router = Router();

  router.post('/orders', async (req: Request, res: Response) => {
    try {
      const { customerId, items } = req.body;
      const order = await orderService.placeOrder(customerId, items);
      res.status(201).json({ data: order });
    } catch (error) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: String(error) } });
    }
  });

  router.get('/orders/:id', async (req: Request, res: Response) => {
    // Simplified - in real app would use orderService to fetch
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
  });

  return router;
}

export function createPaymentRouter(paymentAdapter: PaymentAdapter): Router {
  const router = Router();

  router.post('/payments/charge', async (req: Request, res: Response) => {
    try {
      const { orderId, paymentMethodId } = req.body;
      const result = await paymentAdapter.charge({
        amount: 100, // Would come from order
        currency: 'USD',
        paymentMethodId,
        metadata: { orderId },
      });
      if (result.success) {
        res.json({ data: { transactionId: result.transactionId } });
      } else {
        res.status(402).json({ error: { code: 'PAYMENT_FAILED', message: result.error } });
      }
    } catch (error) {
      res.status(400).json({ error: { code: 'INVALID_REQUEST', message: String(error) } });
    }
  });

  router.post('/payments/webhook', async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const event = paymentAdapter.verifyWebhook(JSON.stringify(req.body), signature);
    if (event) {
      // Handle event
      console.log('Webhook received:', event.type);
    }
    res.json({ received: true });
  });

  return router;
}