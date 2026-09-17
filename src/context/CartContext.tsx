import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ShippingOption } from '../types';
import { getShippingOptions, getStoredSettings } from '../services/storageService';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  couponCode: string;
  couponDiscountPercentage: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  selectedShipping: ShippingOption | null;
  setSelectedShipping: (option: ShippingOption) => void;
  shippingOptions: ShippingOption[];
  shippingCost: number;
  total: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aura_shopping_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(0);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>(() => getShippingOptions());
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(() => {
    const opts = getShippingOptions();
    return opts.find(o => o.active) || opts[0] || null;
  });

  const settings = getStoredSettings();
  const freeShippingThreshold = settings.freeShippingThreshold || 299;

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Free shipping recalculation
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // If qualifies for free shipping and option exists
  useEffect(() => {
    if (subtotal >= freeShippingThreshold) {
      const freeOpt = shippingOptions.find(o => o.minFreeShippingValue && o.minFreeShippingValue <= freeShippingThreshold);
      if (freeOpt && selectedShipping?.id !== freeOpt.id) {
        setSelectedShipping(freeOpt);
      }
    }
  }, [subtotal, freeShippingThreshold, shippingOptions]);

  const discount = (subtotal * couponDiscountPercentage) / 100;
  const shippingCost = selectedShipping ? (subtotal >= freeShippingThreshold && selectedShipping.minFreeShippingValue ? 0 : selectedShipping.price) : 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const addItem = (product: Product, quantity = 1, selectedSize?: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedSize === selectedSize);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity = Math.min(product.stock, copy[existingIndex].quantity + quantity);
        return copy;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity), selectedSize }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clamped = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setCouponDiscountPercentage(0);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AURA10') {
      setCouponCode(clean);
      setCouponDiscountPercentage(10);
      return { success: true, message: 'Cupom AURA10 aplicado! 10% de desconto.' };
    }
    if (clean === 'BEMVINDA' || clean === 'VIP15') {
      setCouponCode(clean);
      setCouponDiscountPercentage(15);
      return { success: true, message: `Cupom ${clean} aplicado! 15% de desconto de boas-vindas.` };
    }
    if (clean === 'OURO20') {
      setCouponCode(clean);
      setCouponDiscountPercentage(20);
      return { success: true, message: 'Cupom OURO20 aplicado! 20% de desconto exclusivo.' };
    }
    return { success: false, message: 'Cupom inválido ou expirado.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountPercentage(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        couponCode,
        couponDiscountPercentage,
        applyCoupon,
        removeCoupon,
        selectedShipping,
        setSelectedShipping,
        shippingOptions,
        shippingCost,
        total,
        freeShippingRemaining,
        freeShippingProgress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
