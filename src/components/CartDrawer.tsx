import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    selectedShipping,
    setSelectedShipping,
    shippingOptions,
    shippingCost,
    total,
    freeShippingRemaining,
    freeShippingProgress
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback(res);
    if (res.success) {
      setInputCoupon('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="shopping-cart-drawer"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E8DFC8]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EDE5D3] bg-[#FAF9F5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B88E1C]" />
              <h2 className="text-base sm:text-lg font-bold font-serif-luxury text-[#1C1815]">
                Sua Sacola de Joias
              </h2>
              <span className="text-xs bg-[#FAF3E0] text-[#967012] font-semibold px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                {items.reduce((s, i) => s + i.quantity, 0)} itens
              </span>
            </div>
            <button
              id="close-cart-drawer"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#FAF6EC] px-5 py-3 border-b border-[#EDE5D3]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#1C1815] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#B88E1C]" />
                {freeShippingRemaining === 0 ? (
                  <span className="text-emerald-700 font-bold">Parabéns! Você ganhou Frete Grátis VIP!</span>
                ) : (
                  <span>
                    Faltam <strong className="text-[#B88E1C]">{formatBRL(freeShippingRemaining)}</strong> para Frete Grátis
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-[#967012]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#E5DCC9] rounded-full h-2 overflow-hidden">
              <div
                className="gold-gradient h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF3E0] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif-luxury font-bold text-lg text-[#1C1815]">
                  Sua sacola está vazia
                </h3>
                <p className="text-xs text-[#6B6154] max-w-xs">
                  Descubra nossas semijóias banhadas a ouro 18k e eleve seu estilo com sofisticação.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-full gold-gradient text-[#1C1815] font-semibold text-xs shadow-xs"
                >
                  Explorar Joias
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl border border-[#EDE5D3] bg-[#FAF9F5] hover:border-[#D4AF37]/50 transition-all"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg border border-[#E0D8C3] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#1C1815] leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#967012] font-medium block mt-0.5">
                        10 Milésimos Ouro 18k
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#EDE5D3]/60">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-[#D4AF37] rounded-md bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#1C1815] hover:bg-[#FAF6EC]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-[#1C1815]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#1C1815] hover:bg-[#FAF6EC]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#1C1815]">
                        {formatBRL(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Calculations and Checkout */}
          {items.length > 0 && (
            <div className="border-t border-[#EDE5D3] bg-[#FAF9F5] p-4 sm:p-5 space-y-4">
              {/* Coupon Code Box */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF3E0] border border-[#D4AF37]/50 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#B88E1C]" />
                      <span className="font-semibold text-[#1C1815]">
                        Cupom {couponCode} aplicado!
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-800 text-[11px] font-bold"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="Cupom (ex: AURA10, BEMVINDA)"
                        className="w-full bg-white border border-[#E0D8C3] focus:border-[#D4AF37] rounded-lg py-2 px-3 text-xs text-[#1C1815] uppercase tracking-wider outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-white hover:bg-[#FAF6EC] border border-[#D4AF37] text-[#1C1815] text-xs font-semibold px-4 rounded-lg transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponFeedback && !couponCode && (
                  <p className="text-[11px] text-red-600 mt-1">{couponFeedback.message}</p>
                )}
              </div>

              {/* Shipping Options Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A433A] block mb-2">
                  Opções de Entrega
                </label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {shippingOptions.filter(o => o.active).map((option) => {
                    const isSelected = selectedShipping?.id === option.id;
                    const isFreeQualified = option.minFreeShippingValue && subtotal >= option.minFreeShippingValue;
                    const priceDisplay = isFreeQualified || option.price === 0 ? 'Grátis' : formatBRL(option.price);

                    return (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#FAF6EC]'
                            : 'border-[#E8DFC8] bg-white hover:bg-[#FAF9F5]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cart-shipping-option"
                            checked={isSelected}
                            onChange={() => setSelectedShipping(option)}
                            className="text-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                          <div>
                            <span className="font-semibold text-[#1C1815] block">{option.name}</span>
                            <span className="text-[10px] text-gray-500">{option.estimatedDays}</span>
                          </div>
                        </div>
                        <span className={`font-bold ${priceDisplay === 'Grátis' ? 'text-emerald-700' : 'text-[#1C1815]'}`}>
                          {priceDisplay}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs text-[#574F44] pt-2 border-t border-[#E8DFC8]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1C1815]">{formatBRL(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Desconto ({couponCode})</span>
                    <span>-{formatBRL(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frete ({selectedShipping?.name || 'Entrega'})</span>
                  <span className="font-medium text-[#1C1815]">
                    {shippingCost === 0 ? 'Grátis' : formatBRL(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1C1815] pt-2 border-t border-[#E8DFC8]">
                  <span>Total</span>
                  <span className="text-[#967012] text-lg">{formatBRL(total)}</span>
                </div>
              </div>

              {/* Primary Checkout Button */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  setIsOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl gold-gradient hover:opacity-95 text-[#1C1815] font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 group transition-all"
              >
                <span>Finalizar Compra com Google</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-center text-[#7A6F62]">
                🔒 Pagamento 100% protegido e processado via Stripe Checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
