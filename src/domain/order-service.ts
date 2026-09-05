import { OrderRepository } from '../repositories/order-repository';
import { PaymentAdapter } from '../payments/adapter';

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private paymentAdapter: PaymentAdapter
  ) {}

  async placeOrder(customerId: string, items: OrderItem[]): Promise<Order> {
    const order = Order.create(customerId, items);
    await this.orderRepo.save(order);
    return order;
  }

  async payOrder(orderId: string, paymentMethodId: string): Promise<PaymentResult> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');
    
    const result = await this.paymentAdapter.charge({
      amount: order.total,
      currency: 'USD',
      paymentMethodId,
      metadata: { orderId }
    });
    
    if (result.success) {
      order.markPaid();
      await this.orderRepo.save(order);
    }
    
    return result;
  }
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class Order {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public readonly total: number,
    public status: 'pending' | 'paid' | 'cancelled' = 'pending'
  ) {}

  static create(customerId: string, items: OrderItem[]): Order {
    const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    return new Order(crypto.randomUUID(), customerId, items, total);
  }

  markPaid(): void {
    this.status = 'paid';
  }
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}