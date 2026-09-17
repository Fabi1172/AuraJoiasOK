import { Order } from '../types';
import { getStoredSettings } from './storageService';

export interface StripeCheckoutParams {
  order: Order;
  successUrl: string;
  cancelUrl: string;
}

export async function processStripePayment(params: StripeCheckoutParams): Promise<{ url?: string; simulated?: boolean; error?: string }> {
  const settings = getStoredSettings();

  // Check if server endpoint or secret key is configured
  try {
    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: params.order.id,
        items: params.order.items,
        customerEmail: params.order.customer.email,
        customerName: params.order.customer.name,
        shippingCost: params.order.shippingCost,
        shippingName: params.order.shippingOption.name,
        total: params.order.total,
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return { url: data.url };
      }
    }
  } catch (err) {
    // Server route might not be running or no secret key configured
    console.log('Direct server stripe session skipped, falling back to configured link/simulator:', err);
  }

  // If a custom Stripe Payment Link is configured in store settings:
  if (settings.defaultStripePaymentLink && settings.defaultStripePaymentLink.startsWith('http') && !settings.defaultStripePaymentLink.includes('test_aura')) {
    const paymentUrl = new URL(settings.defaultStripePaymentLink);
    paymentUrl.searchParams.set('client_reference_id', params.order.id);
    paymentUrl.searchParams.set('prefilled_email', params.order.customer.email);
    return { url: paymentUrl.toString() };
  }

  // Return simulated mode flag for seamless in-app demonstration
  return { simulated: true };
}
