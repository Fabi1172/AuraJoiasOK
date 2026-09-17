import React from 'react';
import { ArrowRight, Sparkles, Gem, ShieldCheck, Award } from 'lucide-react';
import heroImg from '../assets/images/aura_jewelry_hero_1789664593695.jpg';

interface HeroBannerProps {
  onExploreClick: () => void;
  onBestSellersClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onBestSellersClick
}) => {
  return (
    <div className="relative overflow-hidden bg-[#FAF9F5] border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/50 text-[#8F6A10] text-xs font-semibold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E1C]" />
              <span>Alta Joalheria Contemporânea</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-[#1C1917] leading-[1.15] tracking-tight">
              A elegância do ouro 18k com o brilho eterno que você merece.
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#574F44] font-normal leading-relaxed max-w-xl">
              Peças exclusivas com banho de <span className="text-[#967012] font-semibold">10 milésimos de Ouro 18k</span>, microcravação de zircônias 5A e tecnologia antialérgica suíça. O acabamento de joia com 1 ano de garantia.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="hero-cta-explore"
                onClick={onExploreClick}
                className="gold-gradient hover:opacity-95 text-[#1C1815] font-semibold text-sm px-7 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 group"
              >
                <span>Explorar Coleção Completa</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-cta-bestsellers"
                onClick={onBestSellersClick}
                className="bg-white hover:bg-[#FAF6EC] text-[#2C2723] hover:text-[#967012] border border-[#D4AF37] font-medium text-sm px-6 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Gem className="w-4 h-4 text-[#B88E1C]" />
                <span>Mais Vendidas</span>
              </button>
            </div>

            {/* Mini Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EDE5D3]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#B88E1C] shrink-0" />
                <span className="text-[11px] sm:text-xs text-[#4A433A] font-medium">10 Milésimos Ouro 18k</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B88E1C] shrink-0" />
                <span className="text-[11px] sm:text-xs text-[#4A433A] font-medium">1 Ano de Garantia</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B88E1C] shrink-0" />
                <span className="text-[11px] sm:text-xs text-[#4A433A] font-medium">Antialérgico Zero Níquel</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase / Hero Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer decorative halo aura */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#D4AF37] via-[#F5E6A3] to-[#AA7C11] opacity-60 blur-lg" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white bg-white">
                <img
                  src={heroImg}
                  alt="Coleção Exclusiva Aura Semijóias Ouro 18k"
                  referrerPolicy="no-referrer"
                  className="w-full h-[340px] sm:h-[420px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Highlights Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#E8DFC8] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#1C1815]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1815]">Coleção Radiant Aura 2026</p>
                      <p className="text-[11px] text-[#7A6F62]">Lançamentos limitados com parcelamento em até 6x</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#FAF3E0] text-[#967012] border border-[#D4AF37]/30">
                    Ouro 18k
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
