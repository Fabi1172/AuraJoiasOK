import { Product, ShippingOption, StoreSettings, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Colar Riviera Riviera Imperial Ouro 18k',
    category: 'colares',
    price: 349.00,
    originalPrice: 429.00,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Colar Riviera de alto luxo com microcravação de zircônias 5A lapidação brilhante e fecho gaveta de joalheria. Banhado com 10 milésimos de Ouro 18k e dupla camada de verniz protetor italiano.',
    specs: {
      material: 'Liga metálica nobre especial para alta joalheria',
      banho: 'Ouro 18k (10 milésimos)',
      pedras: 'Zircônias Cúbicas Premium 5A Extra Brilho',
      garantia: '1 ano no banho e na microcravação',
      antialergico: true,
      comprimento: '42cm + 5cm extensor'
    },
    featured: true,
    bestSeller: true,
    rating: 5.0,
    reviewsCount: 38,
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Brinco Argola Aura Gota Cravejada Ouro 18k',
    category: 'brincos',
    price: 189.90,
    originalPrice: 229.00,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Argola em formato de gota moderna, com pavê de zircônias frontais e acabamento espelhado polido à mão. Leveza anatômica que não pesa na orelha.',
    specs: {
      material: 'Liga metálica hipoalergênica (Zero Níquel)',
      banho: 'Ouro 18k (10 milésimos)',
      pedras: 'Microzircônias translúcidas',
      garantia: '1 ano de garantia',
      antialergico: true,
      comprimento: '2.8 cm altura'
    },
    featured: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 24,
    createdAt: '2026-03-05T10:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Anel Solitário Majesty Zircônia Oval Ouro 18k',
    category: 'aneis',
    price: 249.00,
    originalPrice: 299.00,
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Anel solitário com imponente gema central de zircônia formato oval 8x10mm sustentada por quatro garras nobres e aro sutilmente cravejado.',
    specs: {
      material: 'Liga nobre italiana',
      banho: 'Ouro 18k (12 milésimos especial)',
      pedras: 'Zircônia Oval Superior 8x10mm',
      garantia: '1 ano de garantia',
      antialergico: true
    },
    featured: true,
    bestSeller: true,
    rating: 4.9,
    reviewsCount: 52,
    createdAt: '2026-02-20T10:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Pulseira Tennis Diamantada Dourada 18k',
    category: 'pulseiras',
    price: 289.00,
    originalPrice: 349.00,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1611591475102-44288006d649?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'A clássica pulseira Tennis reimaginada com flexibilidade ergonômica, brilho contínuo de zircônias e fecho duplo de segurança de joalheria fina.',
    specs: {
      material: 'Semijóia fina banhada a ouro',
      banho: 'Ouro 18k (10 milésimos)',
      pedras: 'Zircônias redondas 3mm',
      garantia: '1 ano de garantia',
      antialergico: true,
      comprimento: '17cm + 3cm extensor'
    },
    featured: true,
    rating: 5.0,
    reviewsCount: 19,
    createdAt: '2026-03-02T10:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Conjunto Colar e Brinco Perla Radiante Ouro 18k',
    category: 'conjuntos',
    price: 429.00,
    originalPrice: 519.00,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Conjunto harmonioso composto por pingente em gota de pérola shell cultivada e brincos correspondentes com halo de microzircônias brilhantes.',
    specs: {
      material: 'Liga nobre banhada com tecnologia antialérgica',
      banho: 'Ouro 18k (10 milésimos)',
      pedras: 'Pérola Shell selecionada e zircônias',
      garantia: '1 ano de garantia',
      antialergico: true,
      comprimento: 'Colar 45cm | Brinco 1.5cm'
    },
    featured: true,
    bestSeller: true,
    rating: 5.0,
    reviewsCount: 41,
    createdAt: '2026-03-08T10:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Choker Malha Fita Dourada Espelhada 4mm',
    category: 'colares',
    price: 219.00,
    originalPrice: 269.00,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Choker em malha fita serpente flexível com acabamento espelhado de alta reflexão. Ajuste perfeito à curvatura do colo, ideal para mix de colares.',
    specs: {
      material: 'Liga nobre com verniz eletrolítico',
      banho: 'Ouro 18k (10 milésimos)',
      garantia: '1 ano de garantia',
      antialergico: true,
      comprimento: '36cm + 7cm extensor'
    },
    isNew: true,
    rating: 4.8,
    reviewsCount: 17,
    createdAt: '2026-03-10T10:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Brinco Ear Cuff Cascata de Cristais 18k',
    category: 'brincos',
    price: 179.00,
    originalPrice: 210.00,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Ear cuff anatômico que desenha a cartilagem com elegância e sofisticação. Dispensa furos adicionais com sistema de pressão suave ajustável.',
    specs: {
      material: 'Semijóia fina hipoalergênica',
      banho: 'Ouro 18k (10 milésimos)',
      pedras: 'Cristais Navete Premium',
      garantia: '1 ano de garantia',
      antialergico: true
    },
    rating: 4.9,
    reviewsCount: 29,
    createdAt: '2026-03-04T10:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Pulseira Elos Cartier com Pingente Coração Relicário',
    category: 'pulseiras',
    price: 269.00,
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591475102-44288006d649?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Pulseira de elos encorpados estilo Cartier com pingente central de coração trabalhado e fecho boia robusto. Uma peça statement clássica.',
    specs: {
      material: 'Liga nobre maciça leve',
      banho: 'Ouro 18k (10 milésimos)',
      garantia: '1 ano de garantia',
      antialergico: true,
      comprimento: '18cm'
    },
    rating: 5.0,
    reviewsCount: 14,
    createdAt: '2026-02-28T10:00:00Z'
  }
];

export const INITIAL_SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'ship-1',
    name: 'Sedex Expresso Ouro',
    description: 'Entrega rápida e rastreada via Sedex com seguro incluso',
    price: 28.90,
    estimatedDays: '1 a 3 dias úteis',
    active: true
  },
  {
    id: 'ship-2',
    name: 'PAC Econômico',
    description: 'Envio padrão com código de rastreio para todo o Brasil',
    price: 18.50,
    estimatedDays: '4 a 8 dias úteis',
    active: true
  },
  {
    id: 'ship-3',
    name: 'Frete Grátis Aura VIP',
    description: 'Benefício exclusivo Aura para compras acima de R$ 299',
    price: 0,
    estimatedDays: '3 a 6 dias úteis',
    minFreeShippingValue: 299,
    active: true
  },
  {
    id: 'ship-4',
    name: 'Entrega Same-Day / Express (Capitais)',
    description: 'Entrega no mesmo dia para pedidos aprovados até as 13h',
    price: 39.90,
    estimatedDays: 'Hoje até 20h',
    active: true
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Aura Semijóias',
  announcementText: '✨ FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 299 | BANHO DE OURO 18K 10 MILÉSIMOS | 1 ANO DE GARANTIA',
  freeShippingThreshold: 299,
  stripeSecretKey: '',
  stripePublishableKey: '',
  defaultStripePaymentLink: 'https://buy.stripe.com/test_aura_semijoias',
  supabaseUrl: '',
  supabaseAnonKey: '',
  googleClientId: '',
  whatsappNumber: '5511999999999',
  adminPin: 'AUADMOK'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'AURA-98214',
    customer: {
      id: 'cust-1',
      name: 'Camila Fernandes',
      email: 'camila.fernandes@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      phone: '(11) 98765-4321',
      address: {
        cep: '01414-001',
        street: 'Alameda Lorena',
        number: '1420',
        complement: 'Apto 82',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP'
      }
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Colar Riviera Riviera Imperial Ouro 18k',
        price: 349.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    subtotal: 349.00,
    discount: 34.90,
    shippingOption: INITIAL_SHIPPING_OPTIONS[2],
    shippingCost: 0,
    total: 314.10,
    status: 'em_separacao',
    paymentMethod: 'stripe',
    trackingCode: 'BR982314567SP',
    createdAt: '2026-03-16T14:20:00Z'
  },
  {
    id: 'AURA-98215',
    customer: {
      id: 'cust-2',
      name: 'Juliana Vasconcelos',
      email: 'ju.vasconcelos@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      phone: '(21) 99123-8844',
      address: {
        cep: '22041-001',
        street: 'Avenida Atlântica',
        number: '2800',
        neighborhood: 'Copacabana',
        city: 'Rio de Janeiro',
        state: 'RJ'
      }
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Brinco Argola Aura Gota Cravejada Ouro 18k',
        price: 189.90,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop'
      },
      {
        productId: 'prod-3',
        productName: 'Anel Solitário Majesty Zircônia Oval Ouro 18k',
        price: 249.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    subtotal: 438.90,
    discount: 0,
    shippingOption: INITIAL_SHIPPING_OPTIONS[0],
    shippingCost: 28.90,
    total: 467.80,
    status: 'pago',
    paymentMethod: 'stripe',
    createdAt: '2026-03-17T09:15:00Z'
  }
];
