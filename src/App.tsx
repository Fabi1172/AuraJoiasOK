import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ValueProps } from './components/ValueProps';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { Product, ProductCategory, Order, ShippingOption, StoreSettings } from './types';
import { getProducts, getOrders, getShippingOptions, getStoredSettings } from './services/storageService';
import { Filter, SlidersHorizontal, Sparkles, Star, ChevronDown, Check, Shield, Gem } from 'lucide-react';

function StoreContent() {
  const { isAuthenticated, user } = useAuth();
  const { addItem, setIsOpen: setIsCartOpen } = useCart();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(getStoredSettings());

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'bestsellers' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Modal states
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    async function load() {
      const p = await getProducts();
      setProducts(p);
      const o = await getOrders();
      setOrders(o);
      setShippingOptions(getShippingOptions());
      setSettings(getStoredSettings());
    }
    load();
  }, []);

  // Check URL query parameters for return from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
      const orderId = params.get('order_id');
      const found = orders.find(o => o.id === orderId);
      if (found) {
        setCompletedOrder(found);
      }
    }
  }, [orders]);

  // Filter and Sort Products
  const filteredProducts = products.filter(p => {
    // Category
    if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchDesc) return false;
    }
    // Stock filter
    if (onlyInStock && p.stock <= 0) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'bestsellers') {
      return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
    }
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    if (sortBy === 'newest') {
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    }
    // Default featured
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Handler: When clicking "Finalizar Compra" in Cart or "Comprar Agora"
  const handleStartCheckout = () => {
    if (!isAuthenticated) {
      // Prompt required Google Registration / Login
      setIsAuthModalOpen(true);
    } else {
      // Proceed to Stripe Payment step
      setIsCheckoutModalOpen(true);
    }
  };

  const handleBuyNowDirect = (product: Product, quantity: number) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsCheckoutModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // Proceed automatically to payment
    setIsCheckoutModalOpen(true);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('aura-catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col selection:bg-[#E8D19F] selection:text-[#1A1A1A]">
      {/* Navigation Header */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        announcementText={settings.announcementText}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Hero Banner with High-Conversion Luxury Atmosphere */}
      <HeroBanner
        onExploreClick={scrollToCatalog}
        onBestSellersClick={() => {
          setSortBy('bestsellers');
          setSelectedCategory('todos');
          scrollToCatalog();
        }}
      />

      {/* Trust Badges Bar */}
      <ValueProps />

      {/* Catalog & Shop Section */}
      <main id="aura-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full flex-1 space-y-8">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8DFC8]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#967012]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Alta Joalheria em Semijóias</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#1C1815]">
              {selectedCategory === 'todos' ? 'Coleção Exclusiva Ouro 18k' : `Coleção de ${selectedCategory.toUpperCase()}`}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6F62]">
              Exibindo <strong className="text-[#1C1815]">{filteredProducts.length}</strong> peças selecionadas com banho de 10 milésimos
            </p>
          </div>

          {/* Sort & Stock Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Stock Filter Toggle */}
            <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#E0D8C3] cursor-pointer hover:border-[#D4AF37] transition-colors">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="text-[#D4AF37] focus:ring-[#D4AF37] rounded"
              />
              <span className="text-[#4A433A] font-medium">Apenas Em Estoque</span>
            </label>

            {/* Sort Select */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#E0D8C3]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B88E1C]" />
              <span className="text-[#7A6F62] hidden sm:inline">Ordenar:</span>
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#1C1815] font-semibold outline-none cursor-pointer"
              >
                <option value="featured">Destaques Aura</option>
                <option value="bestsellers">Mais Vendidos</option>
                <option value="newest">Lançamentos</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-[#EDE5D3] p-8">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E0] flex items-center justify-center mx-auto text-[#B88E1C]">
              <Gem className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-serif-luxury text-[#1C1815]">
              Nenhuma semijóia encontrada com esses filtros
            </h3>
            <p className="text-xs text-[#7A6F62] max-w-sm mx-auto">
              Tente redefinir a busca ou remover os filtros de categoria para explorar outras peças.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
                setOnlyInStock(false);
              }}
              className="px-6 py-2.5 gold-gradient rounded-full font-semibold text-xs text-[#1C1815]"
            >
              Ver Todas as Semijóias
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        {/* High Conversion Brand Story & Assurance */}
        <section className="bg-white rounded-2xl border border-[#EDE5D3] p-8 sm:p-12 my-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E0] text-[#967012] text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Padrão Ouro de Qualidade</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#1C1815]">
                Por que as semijóias Aura não desbotam e duram anos?
              </h3>
              <p className="text-xs sm:text-sm text-[#574F44] leading-relaxed">
                Diferente de bijuterias comuns que recebem apenas banho flash decorativo, todas as semijóias Aura Semijóias recebem um generoso <strong className="text-[#1C1815]">banho de 10 a 12 milésimos de Ouro 18k legítimo</strong>, seguido por uma aplicação nobre de verniz protetor italiano hipoalergênico.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8DFC8] text-center">
                  <span className="text-lg font-bold text-[#967012] block">10 Milésimos</span>
                  <span className="text-[11px] text-gray-600">Espessura Máxima</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8DFC8] text-center">
                  <span className="text-lg font-bold text-[#967012] block">Zero Níquel</span>
                  <span className="text-[11px] text-gray-600">100% Hipoalergênico</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8DFC8] text-center col-span-2 sm:col-span-1">
                  <span className="text-lg font-bold text-[#967012] block">1 Ano</span>
                  <span className="text-[11px] text-gray-600">Garantia Certificada</span>
                </div>
              </div>
            </div>

            {/* Social Proof Testimonials */}
            <div className="lg:col-span-5 bg-[#FAF9F5] p-6 rounded-xl border border-[#E8DFC8] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#967012] flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                <span>Depoimentos de Clientes VIP</span>
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-gray-100 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />)}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "O colar Riviera e a argola em gota são impecáveis. O brilho parece de ouro maciço e o atendimento foi perfeito. Recomendo de olhos fechados!"
                  </p>
                  <span className="font-bold text-[#1C1815] block text-[11px]">— Mariana R., São Paulo</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-100 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />)}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "Chegou em 2 dias com embalagem maravilhosa para presente e certificado de garantia. Comprarei novamente com certeza."
                  </p>
                  <span className="font-bold text-[#1C1815] block text-[11px]">— Beatriz M., Curitiba</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Cart Drawer Component */}
      <CartDrawer onProceedToCheckout={handleStartCheckout} />

      {/* Product Detail Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onBuyNowDirect={handleBuyNowDirect}
      />

      {/* Google Authentication / Registration Required Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Stripe Payment & Order Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOrderCompleted={(order) => {
          setOrders(prev => [order, ...prev]);
          setCompletedOrder(order);
        }}
      />

      {/* Celebratory Order Success Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      {/* Discreet Admin Control Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={setProducts}
        orders={orders}
        onUpdateOrders={setOrders}
        shippingOptions={shippingOptions}
        onUpdateShippingOptions={setShippingOptions}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Footer with discreet admin entrance */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StoreContent />
      </CartProvider>
    </AuthProvider>
  );
}
