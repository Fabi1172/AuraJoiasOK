export type ProductCategory = 'colares' | 'brincos' | 'aneis' | 'pulseiras' | 'conjuntos';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  description: string;
  specs: {
    material: string;
    banho: string;
    pedras?: string;
    garantia: string;
    antialergico: boolean;
    comprimento?: string;
  };
  featured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  stripePaymentLink?: string; // Optional direct custom Stripe link for this item
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  minFreeShippingValue?: number;
  active: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  googleId?: string;
  address?: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export type OrderStatus = 'pendente' | 'pago' | 'em_separacao' | 'enviado' | 'entregue' | 'cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customer: CustomerUser;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingOption: ShippingOption;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'stripe';
  stripeSessionId?: string;
  stripePaymentLink?: string;
  trackingCode?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  announcementText: string;
  freeShippingThreshold: number;
  stripeSecretKey: string;
  stripePublishableKey: string;
  defaultStripePaymentLink: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  googleClientId: string;
  whatsappNumber: string;
  adminPin: string;
}
