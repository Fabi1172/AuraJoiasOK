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
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAuth,
  announcementText
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

            {/* Shopping Cart Drawer Trigger */}
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
