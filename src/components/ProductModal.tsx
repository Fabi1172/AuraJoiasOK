import React, { useState } from 'react';
import { X, Star, ShieldCheck, Sparkles, Check, Truck, Gift, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNowDirect: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onBuyNowDirect
}) => {
  if (!product) return null;

  const { addItem } = useCart();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const installment6x = (product.price / 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    onBuyNowDirect(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        id="product-detail-modal"
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#EDE5D3] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-gray-900 border border-[#E8DFC8] shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Gallery Column */}
          <div className="md:col-span-6 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-square rounded-xl bg-[#FAF9F5] border border-[#EDE5D3] overflow-hidden">
              <img
                src={product.images[selectedImgIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-md text-[11px] font-semibold text-[#8F6A10] border border-[#D4AF37]/30">
                Banho Ouro 18k • 10 Milésimos
              </div>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImgIndex === idx ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30' : 'border-[#E8DFC8] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Foto miniatura ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Packaging / Box Benefit */}
            <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#EDE5D3] flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#B88E1C] shrink-0" />
              <p className="text-xs text-[#574F44]">
                <strong className="text-[#1C1815]">Presente Aura:</strong> Acompanha estojo de veludo aveludado exclusivo e certificado de garantia.
              </p>
            </div>
          </div>

          {/* Product Details Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Ratings */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B88E1C]">
                  {product.category} • Aura Semijóias
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1C1815]">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({product.reviewsCount} avaliações)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#1C1815] mt-2 leading-tight">
                {product.name}
              </h2>

              {/* Price & Installments */}
              <div className="mt-4 p-4 rounded-xl bg-[#FAF9F5] border border-[#E8DFC8]">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1C1815]">
                    {formatBRL(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatBRL(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B6154] mt-1">
                  em até <strong className="text-[#1C1815]">6x de {installment6x}</strong> sem juros no cartão ou com desconto especial no Pix.
                </p>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A433A] mb-1.5">
                  Descrição
                </h4>
                <p className="text-xs sm:text-sm text-[#574F44] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications List */}
              <div className="mt-4 space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-[#4A433A]">
                  Especificações Nobres
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
                  <div className="p-2 bg-[#F9F7F2] rounded border border-[#EDE5D3]">
                    <span className="text-gray-500 block">Banho Nobre</span>
                    <span className="font-semibold text-[#1C1815]">{product.specs.banho}</span>
                  </div>
                  <div className="p-2 bg-[#F9F7F2] rounded border border-[#EDE5D3]">
                    <span className="text-gray-500 block">Garantia</span>
                    <span className="font-semibold text-[#1C1815]">{product.specs.garantia}</span>
                  </div>
                  {product.specs.pedras && (
                    <div className="p-2 bg-[#F9F7F2] rounded border border-[#EDE5D3]">
                      <span className="text-gray-500 block">Pedras</span>
                      <span className="font-semibold text-[#1C1815]">{product.specs.pedras}</span>
                    </div>
                  )}
                  <div className="p-2 bg-[#F9F7F2] rounded border border-[#EDE5D3]">
                    <span className="text-gray-500 block">Acabamento</span>
                    <span className="font-semibold text-[#1C1815]">100% Antialérgico</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart */}
            <div className="pt-4 border-t border-[#EDE5D3] space-y-3">
              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2C2723]">Quantidade:</span>
                <div className="flex items-center border border-[#D4AF37] rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold text-[#1C1815] hover:bg-[#FAF6EC] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold text-[#1C1815]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-sm font-bold text-[#1C1815] hover:bg-[#FAF6EC] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm border border-[#D4AF37] transition-all flex items-center justify-center gap-2 ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-[#FAF6EC] text-[#1C1815]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado à Sacola!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#B88E1C]" />
                      <span>Adicionar à Sacola</span>
                    </>
                  )}
                </button>

                <button
                  id="modal-buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm gold-gradient hover:opacity-95 text-[#1C1815] transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Comprar Agora</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Fast shipping note */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A6F62] pt-1">
                <Truck className="w-3.5 h-3.5 text-[#B88E1C]" />
                <span>Envio rápido com código de rastreio e seguro de entrega</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
