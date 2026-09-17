import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Stripe initialization helper
let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key && key.startsWith('sk_')) {
      stripeClient = new Stripe(key);
    }
  }
  return stripeClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Aura Semijóias', timestamp: new Date().toISOString() });
});

// Create Stripe Checkout Session
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { orderId, items, customerEmail, customerName, shippingCost, shippingName, total, successUrl, cancelUrl } = req.body;

    const stripe = getStripe();
    if (!stripe) {
      return res.status(200).json({
        simulated: true,
        message: 'Stripe secret key not configured on server. Falling back to checkout link or simulator.'
      });
    }

    const lineItems = (items || []).map((item: any) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.productName || 'Semijóia Aura Ouro 18k',
          images: item.image ? [item.image] : []
        },
        unit_amount: Math.round((item.price || 0) * 100)
      },
      quantity: item.quantity || 1
    }));

    // Add shipping as a line item if greater than 0
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: `Frete: ${shippingName || 'Envio Expresso'}`,
            images: []
          },
          unit_amount: Math.round(shippingCost * 100)
        },
        quantity: 1
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      customer_email: customerEmail,
      client_reference_id: orderId,
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `https://${req.headers.host}/?payment_success=true&order_id=${orderId}`,
      cancel_url: cancelUrl || `https://${req.headers.host}/?canceled=true`,
      metadata: {
        orderId,
        customerName: customerName || 'Cliente VIP'
      }
    });

    return res.json({ url: session.url, id: session.id });
  } catch (error: any) {
    console.error('Stripe session creation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Semijóias server running on port ${PORT}`);
  });
}

startServer();
