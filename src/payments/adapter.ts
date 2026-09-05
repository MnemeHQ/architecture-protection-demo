export interface PaymentAdapter {
  charge(request: ChargeRequest): Promise<PaymentResult>;
  refund(transactionId: string, amount?: number): Promise<RefundResult>;
  verifyWebhook(payload: string, signature: string): WebhookEvent | null;
}

export interface ChargeRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

export type WebhookEvent =
  | { type: 'payment.succeeded'; transactionId: string; metadata: Record<string, string> }
  | { type: 'payment.failed'; transactionId: string; error: string }
  | { type: 'refund.succeeded'; refundId: string };