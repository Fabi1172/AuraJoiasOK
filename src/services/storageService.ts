import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, ShippingOption, Order, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SHIPPING_OPTIONS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'aura_products_v1',
  ORDERS: 'aura_orders_v1',
  SHIPPING: 'aura_shipping_v1',
  SETTINGS: 'aura_settings_v1',
  CART: 'aura_cart_v1',
  USER: 'aura_user_v1'
};

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const url = import.meta.env.VITE_SUPABASE_URL || getStoredSettings().supabaseUrl;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || getStoredSettings().supabaseAnonKey;

  if (url && key && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, key);
      return supabaseInstance;
    } catch (e) {
      console.warn('Supabase initialization warning, falling back to local database:', e);
    }
  }
  return null;
}

// Local + Supabase Products
export async function getProducts(): Promise<Product[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (err) {
      console.warn('Silent fallback to local DB:', err);
    }
  }

  // Fallback to localStorage
  const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }
  // Initialize with seed
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export async function saveProducts(products: Product[]): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  const client = getSupabaseClient();
  if (client) {
    try {
      // Upsert products to supabase silently
      await client.from('products').upsert(products);
    } catch (err) {
      console.warn('Silent background save to Supabase:', err);
    }
  }
}

// Orders
export async function getOrders(): Promise<Order[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('orders').select('*').order('createdAt', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Order[];
      }
    } catch (err) {
      console.warn('Order fetch fallback:', err);
    }
  }

  const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
}

export async function saveOrders(orders: Order[]): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('orders').upsert(orders);
    } catch (err) {
      console.warn('Silent background order sync:', err);
    }
  }
}

// Shipping Options
export function getShippingOptions(): ShippingOption[] {
  const local = localStorage.getItem(STORAGE_KEYS.SHIPPING);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(STORAGE_KEYS.SHIPPING, JSON.stringify(INITIAL_SHIPPING_OPTIONS));
  return INITIAL_SHIPPING_OPTIONS;
}

export function saveShippingOptions(options: ShippingOption[]): void {
  localStorage.setItem(STORAGE_KEYS.SHIPPING, JSON.stringify(options));
}

// Store Settings
export function getStoredSettings(): StoreSettings {
  const local = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed.adminPin === '1234' || !parsed.adminPin) {
        parsed.adminPin = 'AUADMOK';
      }
      if (!parsed.whatsappNumber || parsed.whatsappNumber === '5511999999999') {
        parsed.whatsappNumber = '(11) 991326903';
      }
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
      return { ...INITIAL_SETTINGS, ...parsed };
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_SETTINGS;
}

export function saveStoredSettings(settings: StoreSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  supabaseInstance = null; // reset client to re-evaluate with new credentials
}
