import { Order as OrderClass, OrderItem } from '../domain/order-service';

export interface OrderRepository {
  save(order: OrderClass): Promise<void>;
  findById(id: string): Promise<OrderClass | null>;
  findByCustomer(customerId: string): Promise<OrderClass[]>;
}

export { OrderClass as Order, OrderItem };