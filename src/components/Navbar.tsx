import React, { useState } from 'react';
import { ShoppingBag, Search, User, ShieldCheck, Sparkles, X } from 'lucide-react';
import { AuraLogo } from './AuraLogo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductCategory } from '../types';

interface NavbarProps {
  selectedCategory: ProductCategory | 'todos';
  onSelectCategory: (category: ProductCategory | 'todos') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAuth: () => void;
  announcementText: string;
  whatsappNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAuth,
  announcementText,
  whatsappNumber
}) => {
  const { items, setIsOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const categories: { label: string; value: ProductCategory | 'todos' }[] = [
    { label: 'Todas as Joias', value: 'todos' },
    { label: 'Colares', value: 'colares' },
    { label: 'Brincos', value: 'brincos' },
    { label: 'Anéis', value: 'aneis' },
    { label: 'Pulseiras', value: 'pulseiras' },
    { label: 'Conjuntos', value: 'conjuntos' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8DFC8]">
      {/* Top Luxury Announcement Banner */}
      <div className="bg-[#1A1815] text-[#FAF5E8] text-[11px] md:text-xs py-2 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2 border-b border-[#D4AF37]/30">
        <Sparkles className="w-3.5 h-3.5 text-[#E6C975] animate-pulse" />
        <span>{announcementText}</span>
        <Sparkles className="w-3.5 h-3.5 text-[#E6C975] animate-pulse hidden sm:inline" />
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div 
            id="aura-brand-header" 
            onClick={() => onSelectCategory('todos')}
            className="cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
          >
            <AuraLogo size="md" />
          </div>

          {/* Search Input (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              id="search-input-desktop"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por colares, anéis, zircônias..."
              className="w-full bg-[#FAF9F5] border border-[#E0D8C3] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-full py-2.5 pl-11 pr-10 text-xs sm:text-sm text-[#2C2723] placeholder-[#9E9589] transition-all outline-none"
            />
            <Search className="w-4 h-4 text-[#B88E1C] absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User Account & Cart Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Toggle (Mobile) */}
            <button
              id="mobile-search-toggle"
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              className="md:hidden p-2 text-[#4A433B] hover:text-[#B88E1C] transition-colors"
              aria-label="Buscar produtos"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Google / Customer Account */}
            {isAuthenticated && user ? (
              <div className="relative group">
                <button
                  id="user-account-btn"
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-[#E0D8C3] hover:border-[#D4AF37] bg-[#FAF9F5] transition-all"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#2C2723] truncate max-w-[110px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-[#B88E1C] font-medium">Cliente VIP</span>
                  </div>
                </button>
                {/* User Dropdown */}
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#E8DFC8] py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-[#1A1815] truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Encerrar Sessão
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="login-register-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 py-2 px-3 sm:px-4 text-xs font-semibold tracking-wide text-[#2C2723] hover:text-[#B88E1C] bg-[#FAF9F5] hover:bg-[#F5F0E4] border border-[#E0D8C3] rounded-full transition-all"
              >
                <User className="w-4 h-4 text-[#B88E1C]" />
                <span className="hidden sm:inline">Entrar com Google</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            )}

            {/* Shopping Cart Drawer Trigger & Whatsapp Fale Conosco */}
            <div className="flex flex-col items-center">
              <button
                id="open-cart-btn"
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 rounded-full bg-[#FAF9F5] border border-[#E0D8C3] hover:border-[#D4AF37] hover:bg-[#F5EEDC] text-[#2C2723] transition-all flex items-center justify-center group"
                aria-label="Ver sacola de compras"
              >
                <ShoppingBag className="w-5 h-5 text-[#B88E1C] group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full gold-gradient text-[#1A1815] text-[11px] font-bold flex items-center justify-center shadow-md animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Logo abaixo do ícone do carrinho de compras o ícone do Whatsapp e ao lado a frase: Fale Conosco */}
              <a
                id="header-whatsapp-fale-conosco"
                href={`https://wa.me/${(() => {
                  const raw = (whatsappNumber || '5511991326903').replace(/\D/g, '');
                  return raw.startsWith('55') ? raw : `55${raw}`;
                })()}?text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento da Aura Semijóias.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full hover:bg-emerald-50 text-[#1C1815] hover:text-[#1EBE5D] transition-all group cursor-pointer whitespace-nowrap shadow-2xs bg-white/80 border border-emerald-100 hover:border-emerald-300"
                title="Atendimento via WhatsApp (11) 99132-6903 • Fale Conosco"
              >
                <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#1C1815] group-hover:text-emerald-700 tracking-tight">
                  Fale Conosco
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {showSearchMobile && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative">
              <input
                id="search-input-mobile"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar em Aura Semijóias..."
                className="w-full bg-[#FAF9F5] border border-[#D4AF37] rounded-full py-2.5 pl-11 pr-10 text-xs text-[#2C2723] outline-none"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#B88E1C] absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Navigation Bar */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2.5 overflow-x-auto no-scrollbar border-t border-[#F0EBE0]">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                id={`cat-nav-${cat.value}`}
                onClick={() => onSelectCategory(cat.value)}
                className={`text-xs sm:text-sm whitespace-nowrap px-3.5 py-1.5 rounded-full transition-all font-medium tracking-wide ${
                  isActive
                    ? 'gold-gradient text-[#1A1815] font-semibold shadow-sm'
                    : 'text-[#5C5346] hover:text-[#B88E1C] hover:bg-[#F6F2E8]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
