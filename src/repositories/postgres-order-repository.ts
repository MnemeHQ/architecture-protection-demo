import { Pool } from 'pg';
import { OrderRepository, Order, OrderItem } from './order-repository';

export class PostgresOrderRepository implements OrderRepository {
  constructor(private pool: Pool) {}

  async save(order: Order): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      await client.query(
        `INSERT INTO orders (id, customer_id, total, status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET total = $3, status = $4`,
        [order.id, order.customerId, order.total, order.status]
      );
      
      await client.query('DELETE FROM order_items WHERE order_id = $1', [order.id]);
      for (const item of order.items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.productId, item.quantity, item.unitPrice]
        );
      }
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.pool.query(
      `SELECT o.id, o.customer_id, o.total, o.status,
              oi.product_id, oi.quantity, oi.unit_price
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) return null;
    
    const items: OrderItem[] = result.rows
      .filter(r => r.product_id)
      .map(r => ({
        productId: r.product_id,
        quantity: r.quantity,
        unitPrice: Number(r.unit_price)
      }));
    
    return Order.fromPersistence(
      result.rows[0].id,
      result.rows[0].customer_id,
      items,
      Number(result.rows[0].total),
      result.rows[0].status
    );
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    const result = await this.pool.query(
      `SELECT o.id, o.customer_id, o.total, o.status,
              oi.product_id, oi.quantity, oi.unit_price
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.customer_id = $1
       ORDER BY o.id`,
      [customerId]
    );
    
    const ordersMap = new Map<string, Order>();
    for (const row of result.rows) {
      let order = ordersMap.get(row.id);
      if (!order) {
        order = Order.fromPersistence(
          row.id,
          row.customer_id,
          [],
          Number(row.total),
          row.status
        );
        ordersMap.set(row.id, order);
      }
      if (row.product_id) {
        order.items.push({
          productId: row.product_id,
          quantity: row.quantity,
          unitPrice: Number(row.unit_price)
        });
      }
    }
    
    return Array.from(ordersMap.values());
  }
}