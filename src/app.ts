import express from 'express';
import { createOrderRouter } from './api/routes';
import { createPaymentRouter } from './api/routes';
import { OrderService } from './domain/order-service';
import { PostgresOrderRepository } from './repositories/postgres-order-repository';
import { StripeAdapter } from './payments/stripe-adapter';
import { Pool } from 'pg';

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const orderRepo = new PostgresOrderRepository(pool);
const paymentAdapter = new StripeAdapter(
  process.env.STRIPE_SECRET_KEY!,
  process.env.STRIPE_WEBHOOK_SECRET!
);
const orderService = new OrderService(orderRepo, paymentAdapter);

app.use('/api', createOrderRouter(orderService));
app.use('/api', createPaymentRouter(paymentAdapter));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));

export { app };