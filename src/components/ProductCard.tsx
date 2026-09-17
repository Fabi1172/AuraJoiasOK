import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const installmentValue = (product.price / 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const currentImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-[#EDE5D3] hover:border-[#D4AF37] transition-all duration-300 flex flex-col overflow-hidden gold-card-hover cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-square w-full bg-[#F7F5F0] overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.bestSeller && (
            <span className="gold-gradient text-[#1C1815] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Mais Vendido
            </span>
          )}
          {product.isNew && !product.bestSeller && (
            <span className="bg-[#1C1815] text-[#FAF5E8] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              Lançamento
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#C53030] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <button
          id={`quick-view-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute inset-x-4 bottom-3 py-2.5 bg-white/95 backdrop-blur-sm border border-[#E8DFC8] hover:border-[#D4AF37] text-[#1C1815] text-xs font-semibold rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 hover:bg-[#FAF6EC]"
        >
          <Eye className="w-3.5 h-3.5 text-[#B88E1C]" />
          <span>Ver Detalhes</span>
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#7A6F62] mb-1">
            <span className="capitalize font-medium tracking-wide text-[#967012]">
              {product.category} • Ouro 18k
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-semibold text-[#2C2723]">{product.rating.toFixed(1)}</span>
              <span className="text-gray-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-medium text-sm text-[#1C1815] group-hover:text-[#967012] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Stock Notice for urgency */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              ⚡ Apenas {product.stock} peças disponíveis!
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-[11px] text-red-600 font-medium mt-1">
              Esgotado temporariamente
            </p>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-[#F0EAE0] flex items-end justify-between gap-2">
          <div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through block">
                {formatBRL(product.originalPrice)}
              </span>
            )}
            <div className="text-base font-bold text-[#1C1815] tracking-tight">
              {formatBRL(product.price)}
            </div>
            <div className="text-[10px] text-[#7A6F62]">
              ou 6x de <span className="font-semibold text-[#1C1815]">{installmentValue}</span> sem juros
            </div>
          </div>

          {/* Quick Buy / Add button */}
          <button
            id={`add-to-cart-${product.id}`}
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center shrink-0 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : product.stock <= 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'gold-gradient hover:opacity-95 text-[#1C1815] active:scale-95'
            }`}
            aria-label={`Adicionar ${product.name} à sacola`}
          >
            {justAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
