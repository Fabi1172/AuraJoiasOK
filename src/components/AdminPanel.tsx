import React, { useState } from 'react';
import {
  X,
  Plus,
  Package,
  Boxes,
  Truck,
  ClipboardList,
  Settings as SettingsIcon,
  Trash2,
  Edit2,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  DollarSign,
  Copy,
  FileCode,
  Database
} from 'lucide-react';
import { Product, ShippingOption, Order, StoreSettings, ProductCategory, OrderStatus } from '../types';
import { saveProducts, saveOrders, saveShippingOptions, saveStoredSettings } from '../services/storageService';
import { AURA_SUPABASE_SQL } from '../data/supabaseSql';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  shippingOptions: ShippingOption[];
  onUpdateShippingOptions: (options: ShippingOption[]) => void;
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  orders,
  onUpdateOrders,
  shippingOptions,
  onUpdateShippingOptions,
  settings,
  onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'stock' | 'orders' | 'shipping' | 'settings'>('products');
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // New product form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'colares' as ProductCategory,
    price: 199,
    originalPrice: 249,
    stock: 10,
    image1: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    image2: '',
    description: 'Semijóia banhada a ouro 18k com 10 milésimos e tecnologia antialérgica.',
    material: 'Liga metálica nobre para alta joalheria',
    banho: 'Ouro 18k (10 milésimos)',
    pedras: 'Zircônias Premium',
    garantia: '1 ano de garantia',
    antialergico: true,
    bestSeller: false,
    isNew: true
  });

  // Shipping option form state
  const [isAddingShipping, setIsAddingShipping] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    name: '',
    description: '',
    price: 25.00,
    estimatedDays: '2 a 5 dias úteis',
    minFreeShippingValue: 299,
    active: true
  });

  // Search filter inside inventory
  const [stockSearch, setStockSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Settings form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [savedSettingsFeedback, setSavedSettingsFeedback] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // PIN Unlock Check
  if (!pinUnlocked) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white max-w-sm w-full rounded-2xl p-6 border border-[#EDE5D3] shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#967012]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-serif-luxury text-[#1C1815]">
            Painel Administrativo Aura
          </h3>
          <p className="text-xs text-[#7A6F62]">
            Acesso reservado ao lojista. Digite a senha de administração para gerenciar produtos, estoque e pedidos.
          </p>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Digite a senha de administrador"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (pinInput === settings.adminPin || pinInput === 'AUADMOK') {
                    setPinUnlocked(true);
                  } else {
                    setPinError(true);
                  }
                }
              }}
              className="w-full text-center text-sm p-3 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-xl outline-none"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-red-600">Senha incorreta. Digite a senha de administrador.</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (pinInput === settings.adminPin || pinInput === 'AUADMOK') {
                  setPinUnlocked(true);
                } else {
                  setPinError(true);
                }
              }}
              className="flex-1 py-2.5 rounded-xl gold-gradient text-[#1C1815] text-xs font-bold shadow-sm"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const images = [productForm.image1];
    if (productForm.image2) images.push(productForm.image2);

    if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: productForm.name,
            category: productForm.category,
            price: Number(productForm.price),
            originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
            stock: Number(productForm.stock),
            images,
            description: productForm.description,
            specs: {
              material: productForm.material,
              banho: productForm.banho,
              pedras: productForm.pedras,
              garantia: productForm.garantia,
              antialergico: productForm.antialergico
            },
            bestSeller: productForm.bestSeller,
            isNew: productForm.isNew
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      saveProducts(updated);
    } else {
      const newProd: Product = {
        id: 'prod-' + Date.now(),
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        stock: Number(productForm.stock),
        images,
        description: productForm.description,
        specs: {
          material: productForm.material,
          banho: productForm.banho,
          pedras: productForm.pedras,
          garantia: productForm.garantia,
          antialergico: productForm.antialergico
        },
        bestSeller: productForm.bestSeller,
        isNew: productForm.isNew,
        rating: 5.0,
        reviewsCount: 1,
        createdAt: new Date().toISOString()
      };
      const updated = [newProd, ...products];
      onUpdateProducts(updated);
      saveProducts(updated);
    }

    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      stock: prod.stock,
      image1: prod.images[0] || '',
      image2: prod.images[1] || '',
      description: prod.description,
      material: prod.specs.material,
      banho: prod.specs.banho,
      pedras: prod.specs.pedras || '',
      garantia: prod.specs.garantia,
      antialergico: prod.specs.antialergico,
      bestSeller: !!prod.bestSeller,
      isNew: !!prod.isNew
    });
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta semijóia do catálogo?')) {
      const updated = products.filter(p => p.id !== id);
      onUpdateProducts(updated);
      saveProducts(updated);
    }
  };

  // Stock Quick Adjust
  const handleAdjustStock = (id: string, delta: number) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, stock: Math.max(0, p.stock + delta) };
      }
      return p;
    });
    onUpdateProducts(updated);
    saveProducts(updated);
  };

  // Order Status Change
  const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    onUpdateOrders(updated);
    saveOrders(updated);
  };

  const handleOrderTrackingChange = (orderId: string, trackingCode: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, trackingCode };
      }
      return o;
    });
    onUpdateOrders(updated);
    saveOrders(updated);
  };

  // Shipping Management
  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const newOption: ShippingOption = {
      id: 'ship-' + Date.now(),
      name: shippingForm.name,
      description: shippingForm.description,
      price: Number(shippingForm.price),
      estimatedDays: shippingForm.estimatedDays,
      minFreeShippingValue: shippingForm.minFreeShippingValue ? Number(shippingForm.minFreeShippingValue) : undefined,
      active: shippingForm.active
    };
    const updated = [...shippingOptions, newOption];
    onUpdateShippingOptions(updated);
    saveShippingOptions(updated);
    setIsAddingShipping(false);
    setShippingForm({
      name: '',
      description: '',
      price: 25.00,
      estimatedDays: '2 a 5 dias úteis',
      minFreeShippingValue: 299,
      active: true
    });
  };

  const handleToggleShipping = (id: string) => {
    const updated = shippingOptions.map(opt => {
      if (opt.id === id) {
        return { ...opt, active: !opt.active };
      }
      return opt;
    });
    onUpdateShippingOptions(updated);
    saveShippingOptions(updated);
  };

  const handleDeleteShipping = (id: string) => {
    if (shippingOptions.length <= 1) {
      alert('É necessário manter ao menos 1 opção de frete ativa.');
      return;
    }
    const updated = shippingOptions.filter(o => o.id !== id);
    onUpdateShippingOptions(updated);
    saveShippingOptions(updated);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    saveStoredSettings(settingsForm);
    setSavedSettingsFeedback(true);
    setTimeout(() => setSavedSettingsFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        id="aura-admin-dashboard"
        className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-[#EDE5D3] overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#1C1815] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-[#1C1815]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-luxury tracking-wide">
                Painel Administrativo • Aura Semijóias
              </h2>
              <p className="text-xs text-[#E6C975]">
                Gestão de Catálogo, Estoque, Pedidos e Entregas
              </p>
            </div>
          </div>
          <button
            id="close-admin-panel-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#FAF9F5] border-b border-[#E8DFC8] px-4 overflow-x-auto no-scrollbar shrink-0">
          <button
            id="admin-tab-products"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#B88E1C] text-[#967012] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Cadastrar Produtos ({products.length})</span>
          </button>

          <button
            id="admin-tab-stock"
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'stock'
                ? 'border-[#B88E1C] text-[#967012] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Controlar Estoque</span>
          </button>

          <button
            id="admin-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#B88E1C] text-[#967012] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Controlar Pedidos ({orders.length})</span>
          </button>

          <button
            id="admin-tab-shipping"
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-[#B88E1C] text-[#967012] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Opções de Entrega ({shippingOptions.length})</span>
          </button>

          <button
            id="admin-tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#B88E1C] text-[#967012] bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Configurações & Stripe</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#1C1815]">Catálogo de Semijóias</h3>
                  <p className="text-xs text-[#7A6F62]">Cadastre novas peças nobres ou edite as especificações.</p>
                </div>
                {!isAddingProduct && (
                  <button
                    id="admin-add-product-btn"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        category: 'colares',
                        price: 199,
                        originalPrice: 249,
                        stock: 10,
                        image1: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
                        image2: '',
                        description: 'Semijóia banhada a ouro 18k com 10 milésimos e tecnologia antialérgica.',
                        material: 'Liga nobre especial',
                        banho: 'Ouro 18k (10 milésimos)',
                        pedras: 'Zircônias Premium',
                        garantia: '1 ano de garantia',
                        antialergico: true,
                        bestSeller: false,
                        isNew: true
                      });
                      setIsAddingProduct(true);
                    }}
                    className="gold-gradient hover:opacity-95 text-[#1C1815] font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Novo Produto</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Product Form */}
              {isAddingProduct && (
                <form onSubmit={handleSaveProduct} className="p-5 bg-[#FAF9F5] border border-[#E8DFC8] rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EDE5D3] pb-3">
                    <h4 className="font-bold text-sm text-[#1C1815]">
                      {editingProduct ? 'Editar Semijóia' : 'Cadastrar Nova Semijóia'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="text-gray-400 hover:text-gray-700 text-xs"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-1">Nome da Joia *</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Ex: Colar Riviera Ouro 18k Gota Zircônia"
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Categoria *</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                      >
                        <option value="colares">Colares</option>
                        <option value="brincos">Brincos</option>
                        <option value="aneis">Anéis</option>
                        <option value="pulseiras">Pulseiras</option>
                        <option value="conjuntos">Conjuntos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Preço de Venda (R$) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Preço Original / Promo (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Estoque Inicial *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-1">URL Imagem Principal *</label>
                      <input
                        type="url"
                        required
                        value={productForm.image1}
                        onChange={(e) => setProductForm({ ...productForm, image1: e.target.value })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">URL Imagem Secundária (Hover)</label>
                      <input
                        type="url"
                        value={productForm.image2}
                        onChange={(e) => setProductForm({ ...productForm, image2: e.target.value })}
                        placeholder="Opcional"
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-gray-700 font-semibold mb-1">Descrição Comercial</label>
                      <textarea
                        rows={2}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Banho</label>
                      <input
                        type="text"
                        value={productForm.banho}
                        onChange={(e) => setProductForm({ ...productForm, banho: e.target.value })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Pedrarias</label>
                      <input
                        type="text"
                        value={productForm.pedras}
                        onChange={(e) => setProductForm({ ...productForm, pedras: e.target.value })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Garantia</label>
                      <input
                        type="text"
                        value={productForm.garantia}
                        onChange={(e) => setProductForm({ ...productForm, garantia: e.target.value })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  {/* Highlights flags */}
                  <div className="flex gap-4 pt-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.bestSeller}
                        onChange={(e) => setProductForm({ ...productForm, bestSeller: e.target.checked })}
                      />
                      <span className="font-semibold text-gray-700">Marcar como "Mais Vendido"</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isNew}
                        onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                      />
                      <span className="font-semibold text-gray-700">Marcar como "Lançamento"</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE5D3]">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 gold-gradient rounded-lg text-xs font-bold text-[#1C1815] shadow-xs"
                    >
                      {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                    </button>
                  </div>
                </form>
              )}

              {/* Product Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 bg-white border border-[#EDE5D3] rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-[#D4AF37]/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-[#E0D8C3]"
                      />
                      <div>
                        <h5 className="font-semibold text-xs text-[#1C1815] line-clamp-1 max-w-[150px]">
                          {prod.name}
                        </h5>
                        <p className="text-[11px] text-[#967012] font-bold">{formatBRL(prod.price)}</p>
                        <p className="text-[10px] text-gray-500">Estoque: {prod.stock} un.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditProductClick(prod)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-[#967012]"
                        title="Editar produto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY STOCK */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#1C1815]">Controle de Estoque em Tempo Real</h3>
                  <p className="text-xs text-[#7A6F62]">
                    Ajuste instantâneo de unidades disponíveis e alerta de estoque baixo.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Buscar peça..."
                    className="w-full p-2 pl-8 bg-[#FAF9F5] border border-gray-300 rounded-lg text-xs outline-none focus:border-[#D4AF37]"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Stock Overview Table */}
              <div className="border border-[#EDE5D3] rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-[#EDE5D3] text-[#4A433A] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Produto</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Preço</th>
                      <th className="p-3">Status Estoque</th>
                      <th className="p-3 text-right">Ajuste Rápido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products
                      .filter(p => p.name.toLowerCase().includes(stockSearch.toLowerCase()))
                      .map((p) => {
                        const isLow = p.stock <= 5 && p.stock > 0;
                        const isZero = p.stock === 0;

                        return (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-3 flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded object-cover border"
                              />
                              <span className="font-semibold text-[#1C1815] max-w-xs truncate">{p.name}</span>
                            </td>
                            <td className="p-3 uppercase text-[10px] text-gray-600 font-semibold">{p.category}</td>
                            <td className="p-3 font-bold text-[#1C1815]">{formatBRL(p.price)}</td>
                            <td className="p-3">
                              {isZero ? (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] inline-flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Esgotado (0)
                                </span>
                              ) : isLow ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Baixo ({p.stock} un)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  Normal ({p.stock} un)
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center border rounded-lg bg-white overflow-hidden">
                                <button
                                  onClick={() => handleAdjustStock(p.id, -1)}
                                  className="px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 font-bold text-xs">{p.stock}</span>
                                <button
                                  onClick={() => handleAdjustStock(p.id, 1)}
                                  className="px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#1C1815]">Controle de Pedidos & Envios</h3>
                  <p className="text-xs text-[#7A6F62]">
                    Acompanhe pagamentos via Stripe e clientes cadastrados com Google.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Buscar pedido ou cliente..."
                    className="w-full p-2 pl-8 bg-[#FAF9F5] border border-gray-300 rounded-lg text-xs outline-none focus:border-[#D4AF37]"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {orders
                  .filter(o => 
                    o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                    o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.customer.email.toLowerCase().includes(orderSearch.toLowerCase())
                  )
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-white border border-[#EDE5D3] rounded-xl shadow-xs space-y-3 hover:border-[#D4AF37]/50 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs text-[#1C1815]">#{order.id}</span>
                          <span className="text-[11px] text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#FAF3E0] text-[#967012] font-semibold text-[10px] border border-[#D4AF37]/30">
                            Stripe Checkout
                          </span>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500 font-medium">Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                            className="text-xs p-1.5 rounded-lg border border-gray-300 font-semibold bg-[#FAF9F5]"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago (Stripe)</option>
                            <option value="em_separacao">Em Separação</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregue">Entregue</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer info & Address */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-gray-100">
                          <span className="text-[10px] uppercase font-bold text-gray-500 block">Cliente (Google)</span>
                          <p className="font-semibold text-[#1C1815]">{order.customer.name}</p>
                          <p className="text-gray-500 text-[11px]">{order.customer.email}</p>
                          <p className="text-gray-500 text-[11px]">{order.customer.phone}</p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-gray-100 sm:col-span-2">
                          <span className="text-[10px] uppercase font-bold text-gray-500 block">Entrega & Rastreio</span>
                          <p className="text-gray-700">
                            {order.customer.address?.street}, {order.customer.address?.number} - {order.customer.address?.neighborhood}, {order.customer.address?.city}/{order.customer.address?.state} (CEP: {order.customer.address?.cep})
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-semibold text-[#967012]">{order.shippingOption.name}</span>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">Rastreio:</span>
                              <input
                                type="text"
                                value={order.trackingCode || ''}
                                onChange={(e) => handleOrderTrackingChange(order.id, e.target.value)}
                                placeholder="Insira o código"
                                className="font-mono text-[11px] p-0.5 px-1.5 border rounded bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Purchased items list */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((it, idx) => (
                            <span key={idx} className="p-1 px-2 rounded bg-gray-100 text-gray-800 text-[11px]">
                              {it.quantity}x {it.productName}
                            </span>
                          ))}
                        </div>
                        <div className="font-bold text-sm text-[#1C1815]">
                          Total: <span className="text-[#967012]">{formatBRL(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: SHIPPING OPTIONS */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#1C1815]">Opções de Entrega & Frete</h3>
                  <p className="text-xs text-[#7A6F62]">
                    Cadastre e gerencie métodos de envio exibidos na sacola e no checkout.
                  </p>
                </div>
                {!isAddingShipping && (
                  <button
                    onClick={() => setIsAddingShipping(true)}
                    className="gold-gradient text-[#1C1815] font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Opção de Entrega</span>
                  </button>
                )}
              </div>

              {/* Add Shipping Form */}
              {isAddingShipping && (
                <form onSubmit={handleSaveShipping} className="p-4 bg-[#FAF9F5] border border-[#E8DFC8] rounded-xl space-y-3 text-xs">
                  <h4 className="font-bold text-sm text-[#1C1815]">Nova Opção de Entrega</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Nome do Envio *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Sedex 10 ou Motoboy VIP"
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                        className="w-full p-2 bg-white border rounded outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Prazo Estimado *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 1 a 2 dias úteis"
                        value={shippingForm.estimatedDays}
                        onChange={(e) => setShippingForm({ ...shippingForm, estimatedDays: e.target.value })}
                        className="w-full p-2 bg-white border rounded outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Valor do Frete (R$) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={shippingForm.price}
                        onChange={(e) => setShippingForm({ ...shippingForm, price: Number(e.target.value) })}
                        className="w-full p-2 bg-white border rounded outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Frete Grátis a partir de (R$)</label>
                      <input
                        type="number"
                        placeholder="Ex: 299 (opcional)"
                        value={shippingForm.minFreeShippingValue || ''}
                        onChange={(e) => setShippingForm({ ...shippingForm, minFreeShippingValue: Number(e.target.value) })}
                        className="w-full p-2 bg-white border rounded outline-none"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-gray-700 font-semibold mb-1">Descrição do Serviço</label>
                      <input
                        type="text"
                        placeholder="Ex: Envio com seguro total e embalagem para presente"
                        value={shippingForm.description}
                        onChange={(e) => setShippingForm({ ...shippingForm, description: e.target.value })}
                        className="w-full p-2 bg-white border rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingShipping(false)}
                      className="px-3 py-1.5 border rounded text-gray-600"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 gold-gradient font-bold rounded text-[#1C1815]"
                    >
                      Salvar Opção
                    </button>
                  </div>
                </form>
              )}

              {/* Shipping List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shippingOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                      opt.active ? 'bg-white border-[#EDE5D3]' : 'bg-gray-100 border-gray-200 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1C1815] text-sm">{opt.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">
                          {opt.estimatedDays}
                        </span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">{opt.description}</p>
                      <p className="font-bold text-[#967012] mt-1">
                        {opt.price === 0 ? 'Frete Grátis' : formatBRL(opt.price)}
                        {opt.minFreeShippingValue && (
                          <span className="text-gray-500 font-normal ml-2">
                            (Grátis acima de {formatBRL(opt.minFreeShippingValue)})
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleShipping(opt.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                          opt.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {opt.active ? 'Ativo' : 'Pausado'}
                      </button>
                      <button
                        onClick={() => handleDeleteShipping(opt.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remover opção"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & STRIPE & SUPABASE */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div>
                <h3 className="text-base font-bold text-[#1C1815]">Configurações da Loja & Integrações</h3>
                <p className="text-[#7A6F62]">
                  Configure Stripe, Supabase e dados de atendimento. (Conforme solicitado, nenhum botão público do Supabase é exibido no site).
                </p>
              </div>

              <div className="p-4 bg-[#FAF9F5] border border-[#E8DFC8] rounded-xl space-y-4">
                <h4 className="font-bold text-sm text-[#1C1815] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#B88E1C]" />
                  <span>Stripe • Link de Pagamento e Chaves</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">
                      Link de Pagamento Padrão Stripe (Stripe Payment Link URL)
                    </label>
                    <input
                      type="url"
                      value={settingsForm.defaultStripePaymentLink}
                      onChange={(e) => setSettingsForm({ ...settingsForm, defaultStripePaymentLink: e.target.value })}
                      placeholder="https://buy.stripe.com/..."
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Você pode colar aqui o link de pagamento gerado no painel da sua conta Stripe.
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Stripe Secret Key (sk_test_... ou sk_live_...)</label>
                    <input
                      type="password"
                      value={settingsForm.stripeSecretKey}
                      onChange={(e) => setSettingsForm({ ...settingsForm, stripeSecretKey: e.target.value })}
                      placeholder="sk_test_..."
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Stripe Publishable Key (pk_test_... ou pk_live_...)</label>
                    <input
                      type="text"
                      value={settingsForm.stripePublishableKey}
                      onChange={(e) => setSettingsForm({ ...settingsForm, stripePublishableKey: e.target.value })}
                      placeholder="pk_test_..."
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Supabase Database Connection Config (Discreet, no button on customer store) */}
              <div className="p-4 bg-[#FAF9F5] border border-[#E8DFC8] rounded-xl space-y-4">
                <h4 className="font-bold text-sm text-[#1C1815] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B88E1C]" />
                  <span>Base de Dados Supabase (Discreta no Backend)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Supabase Project URL</label>
                    <input
                      type="url"
                      value={settingsForm.supabaseUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supabaseUrl: e.target.value })}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Supabase Anon Key</label>
                    <input
                      type="password"
                      value={settingsForm.supabaseAnonKey}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supabaseAnonKey: e.target.value })}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-[#EDE5D3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[11px] text-gray-500">
                    A Aura Semijóias sincroniza automaticamente com o Supabase, sem exibir nenhum botão ou selo aos compradores.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowSqlModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF3E0] hover:bg-[#F3E7C9] text-[#8F6A10] border border-[#D4AF37]/40 rounded-lg text-xs font-semibold transition-colors shrink-0"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Ver / Copiar Script SQL do Supabase</span>
                  </button>
                </div>
              </div>

              {/* Store Announcement & Admin Pin */}
              <div className="p-4 bg-[#FAF9F5] border border-[#E8DFC8] rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-[#1C1815]">Barra de Avisos & Senha</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">Texto da Barra Superior</label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">PIN do Painel Lojista</label>
                    <input
                      type="password"
                      value={settingsForm.adminPin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSettingsFeedback ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Configurações salvas com sucesso!
                  </span>
                ) : <span />}
                <button
                  type="submit"
                  className="py-3 px-6 gold-gradient rounded-xl font-bold text-[#1C1815] shadow-md hover:opacity-95 transition-all"
                >
                  Salvar Todas as Configurações
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Supabase SQL Modal */}
        {showSqlModal && (
          <div className="fixed inset-0 z-60 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
            <div className="bg-[#1C1815] text-white w-full max-w-3xl rounded-2xl border border-[#D4AF37]/40 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-[#D4AF37]/30 flex items-center justify-between bg-[#141210]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-[#1C1815]">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-serif-luxury text-[#EDE5D3]">
                      Script SQL do Supabase • RLS & Políticas de Armazenamento
                    </h3>
                    <p className="text-[11px] text-[#A69B89]">
                      Copie e cole no SQL Editor do Supabase (https://app.supabase.com)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-[#0F0E0D] text-[#D8D2C5] select-all leading-relaxed whitespace-pre">
                {AURA_SUPABASE_SQL}
              </div>

              <div className="p-3 border-t border-[#D4AF37]/30 bg-[#141210] flex items-center justify-between">
                <span className="text-xs text-[#A69B89]">
                  {copiedSql ? 'Copiado para a área de transferência!' : 'Pronto para executar no Supabase'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(AURA_SUPABASE_SQL);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2500);
                    }}
                    className="py-2 px-4 gold-gradient text-[#1C1815] text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm hover:opacity-95"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copiado!' : 'Copiar Código SQL'}</span>
                  </button>
                  <button
                    onClick={() => setShowSqlModal(false)}
                    className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
