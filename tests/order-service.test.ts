import { describe, it, expect, vi } from 'vitest';
import { OrderService, Order, OrderItem } from '../src/domain/order-service';
import { OrderRepository } from '../src/repositories/order-repository';
import { PaymentAdapter, PaymentResult } from '../src/payments/adapter';

class MockOrderRepo implements OrderRepository {
  private orders = new Map<string, Order>();
  
  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }
  
  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }
  
  async findByCustomer(customerId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.customerId === customerId);
  }
}

class MockPaymentAdapter implements PaymentAdapter {
  private shouldSucceed = true;
  private transactionId = 'txn_test';
  
  setShouldSucceed(succeed: boolean): void {
    this.shouldSucceed = succeed;
  }
  
  async charge(): Promise<PaymentResult> {
    if (this.shouldSucceed) {
      return { success: true, transactionId: this.transactionId };
    }
    return { success: false, error: 'Card declined' };
  }
  
  async refund(): Promise<{ success: boolean; refundId?: string; error?: string }> {
    return { success: true, refundId: 're_test' };
  }
  
  verifyWebhook(): null {
    return null;
  }
}

describe('OrderService', () => {
  it('creates an order and saves it', async () => {
    const repo = new MockOrderRepo();
    const payment = new MockPaymentAdapter();
    const service = new OrderService(repo, payment);
    
    const items: OrderItem[] = [
      { productId: 'prod_1', quantity: 2, unitPrice: 10 }
    ];
    
    const order = await service.placeOrder('cust_1', items);
    
    expect(order.customerId).toBe('cust_1');
    expect(order.items).toEqual(items);
    expect(order.total).toBe(20);
    expect(order.status).toBe('pending');
  });

  it('pays an order successfully', async () => {
    const repo = new MockOrderRepo();
    const payment = new MockPaymentAdapter();
    const service = new OrderService(repo, payment);
    
    const items: OrderItem[] = [{ productId: 'prod_1', quantity: 1, unitPrice: 50 }];
    const order = await service.placeOrder('cust_1', items);
    
    const result = await service.payOrder(order.id, 'pm_test');
    
    expect(result.success).toBe(true);
    expect(result.transactionId).toBe('txn_test');
    
    const updated = await repo.findById(order.id);
    expect(updated?.status).toBe('paid');
  });

  it('handles payment failure', async () => {
    const repo = new MockOrderRepo();
    const payment = new MockPaymentAdapter();
    payment.setShouldSucceed(false);
    const service = new OrderService(repo, payment);
    
    const items: OrderItem[] = [{ productId: 'prod_1', quantity: 1, unitPrice: 50 }];
    const order = await service.placeOrder('cust_1', items);
    
    const result = await service.payOrder(order.id, 'pm_test');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Card declined');
    
    const updated = await repo.findById(order.id);
    expect(updated?.status).toBe('pending');
  });
});