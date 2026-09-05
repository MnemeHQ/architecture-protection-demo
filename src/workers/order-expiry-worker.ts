import { OrderRepository } from '../repositories/order-repository';
import { PaymentAdapter } from '../payments/adapter';

export class OrderExpiryWorker {
  constructor(
    private orderRepo: OrderRepository,
    private paymentAdapter: PaymentAdapter
  ) {}

  async run(): Promise<void> {
    // In a real app, this would query for expired pending orders
    // and process refunds or cancellations
    console.log('Checking for expired orders...');
  }
}