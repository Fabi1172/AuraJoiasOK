import React, { useState } from 'react';
import { X, ShieldCheck, Lock, ExternalLink, CreditCard, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { processStripePayment } from '../services/stripeService';
import { saveOrders, getOrders, saveProducts, getProducts } from '../services/storageService';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const { items, subtotal, discount, shippingCost, total, selectedShipping, clearCart } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'review' | 'paying'>('review');

  if (!isOpen || !user || !selectedShipping) return null;

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handlePayWithStripe = async () => {
    setProcessing(true);
    setPaymentStep('paying');

    const newOrderId = 'AURA-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: newOrderId,
      customer: user,
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      })),
      subtotal,
      discount,
      shippingOption: selectedShipping,
      shippingCost,
      total,
      status: 'pago',
      paymentMethod: 'stripe',
      trackingCode: 'BR' + Math.floor(100000000 + Math.random() * 900000000) + 'AU',
      createdAt: new Date().toISOString()
    };

    // Save order to store persistence
    try {
      const currentOrders = await getOrders();
      await saveOrders([newOrder, ...currentOrders]);

      // Deduct stock for purchased items
      const currentProducts = await getProducts();
      const updatedProducts = currentProducts.map(prod => {
        const cartMatch = items.find(ci => ci.product.id === prod.id);
        if (cartMatch) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartMatch.quantity)
          };
        }
        return prod;
      });
      await saveProducts(updatedProducts);
    } catch (e) {
      console.error('Order saving error:', e);
    }

    // Call Stripe payment service
    const stripeResult = await processStripePayment({
      order: newOrder,
      successUrl: window.location.href + '?payment_success=true&order_id=' + newOrderId,
      cancelUrl: window.location.href
    });

    if (stripeResult.url) {
      // Direct redirect to live Stripe Payment Link or Checkout Session URL
      window.location.href = stripeResult.url;
      return;
    }

    // Interactive Stripe sandbox completion
    setTimeout(() => {
      setProcessing(false);
      clearCart();
      onOrderCompleted(newOrder);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="stripe-checkout-modal"
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#EDE5D3] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1C1815] text-[#FAF5E8] p-5 sm:p-6 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-[#1C1815]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
                Checkout Seguro • Aura Semijóias
              </h2>
              <p className="text-xs text-[#E6C975]">
                Ambiente criptografado com processamento oficial Stripe
              </p>
            </div>
          </div>
          {!processing && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {paymentStep === 'paying' ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto animate-spin">
                <Sparkles className="w-8 h-8 text-[#1C1815]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1815] font-serif-luxury">
                Conectando ao Stripe Checkout...
              </h3>
              <p className="text-xs text-[#7A6F62] max-w-sm mx-auto">
                Validando token de segurança e gerando link de confirmação do pedido para {user.email}...
              </p>
            </div>
          ) : (
            <>
              {/* Customer Google Identity */}
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8DFC8] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1C1815]">{user.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Google Autenticado
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6F62]">{user.email} • {user.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Summary */}
              {user.address && (
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8DFC8] text-xs">
                  <span className="font-bold text-[#1C1815] uppercase tracking-wider text-[11px] block mb-1">
                    Endereço de Entrega & Rastreio:
                  </span>
                  <p className="text-[#574F44]">
                    {user.address.street}, {user.address.number} {user.address.complement ? `(${user.address.complement})` : ''} - {user.address.neighborhood}
                  </p>
                  <p className="text-[#7A6F62]">
                    {user.address.city}/{user.address.state} • CEP: {user.address.cep}
                  </p>
                </div>
              )}

              {/* Order Items Preview */}
              <div className="space-y-2">
                <span className="font-bold text-[#1C1815] uppercase tracking-wider text-[11px] block">
                  Itens do Pedido ({items.length})
                </span>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="text-[#1C1815] font-medium truncate max-w-[220px]">
                          {item.quantity}x {item.product.name}
                        </span>
                      </div>
                      <span className="font-bold text-[#1C1815]">
                        {formatBRL(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="p-4 rounded-xl bg-[#FAF6EC] border border-[#D4AF37]/40 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#574F44]">
                  <span>Subtotal dos produtos</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Desconto promocional</span>
                    <span>-{formatBRL(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#574F44]">
                  <span>Frete ({selectedShipping.name})</span>
                  <span>{shippingCost === 0 ? 'Grátis' : formatBRL(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1C1815] pt-2 border-t border-[#D4AF37]/30">
                  <span>Valor Total</span>
                  <span className="text-lg text-[#967012]">{formatBRL(total)}</span>
                </div>
              </div>

              {/* Stripe Payment Button */}
              <button
                id="stripe-confirm-payment-btn"
                onClick={handlePayWithStripe}
                disabled={processing}
                className="w-full py-4 px-6 rounded-xl gold-gradient hover:opacity-95 text-[#1C1815] font-bold text-sm shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer group"
              >
                <CreditCard className="w-5 h-5 text-[#1C1815]" />
                <span>Pagar {formatBRL(total)} com Stripe</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-[#7A6F62] pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pagamento processado com segurança pela plataforma Stripe</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
