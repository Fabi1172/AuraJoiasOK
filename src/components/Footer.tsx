import React from 'react';
import { ShieldCheck, Heart, Lock, Key, CreditCard, Sparkles, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { AuraLogo } from './AuraLogo';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#FAF8F2] border-t border-[#E8DFC8] pt-14 pb-8 text-[#574F44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <AuraLogo size="md" />
            <p className="text-xs sm:text-sm text-[#6E6456] leading-relaxed max-w-sm">
              Semijóias de alto padrão concebidas para mulheres sofisticadas. Peças nobres com camada espessa de 10 milésimos de Ouro 18k, microcravação artesanal de zircônias e 1 ano de garantia com certificado.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="text-[11px] font-semibold text-[#8F6A10] px-3 py-1 bg-white rounded-full border border-[#D4AF37]/40 shadow-2xs">
                ✨ Banho Hipoalergênico Zero Níquel
              </span>
            </div>
            {/* Social Links */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                id="footer-social-instagram"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF6EC] border border-[#E0D8C3] hover:border-[#D4AF37] text-[#574F44] hover:text-[#967012] text-xs font-semibold transition-all shadow-2xs group"
                title="Siga a Aura Semijóias no Instagram"
              >
                <Instagram className="w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform" />
                <span>Instagram</span>
              </a>
              <a
                id="footer-social-facebook"
                href="https://www.facebook.com/?locale=pt_BR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF6EC] border border-[#E0D8C3] hover:border-[#1877F2]/40 text-[#574F44] hover:text-[#1877F2] text-xs font-semibold transition-all shadow-2xs group"
                title="Acompanhe a Aura Semijóias no Facebook"
              >
                <Facebook className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Column 2: Coleções */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C1815]">
              Coleções Exclusivas
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Colares & Chokers Riviera</span></li>
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Argolas & Brincos em Gota</span></li>
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Anéis Solitários Majesty</span></li>
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Pulseiras Tennis & Cartier</span></li>
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Conjuntos Para Ocasiões Nobres</span></li>
            </ul>
          </div>

          {/* Column 3: Atendimento & Garantia */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C1815]">
              Atendimento VIP
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Como Cuidar da sua Semijóia</span></li>
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Certificado de 1 Ano de Banho</span></li>
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Política de Troca Fácil (30 dias)</span></li>
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Prazos e Rastreamento de Envio</span></li>
              <li><span className="hover:text-[#967012] cursor-pointer transition-colors">Dúvidas Frequentes</span></li>
            </ul>
          </div>

          {/* Column 4: Pagamento & Segurança */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1C1815]">
              Segurança & Pagamento
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <CreditCard className="w-4 h-4 text-[#B88E1C]" />
                <span>Processamento Oficial Stripe</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Criptografia 256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <ShieldCheck className="w-4 h-4 text-[#B88E1C]" />
                <span>Autenticação Google Identity</span>
              </div>
              <p className="text-[11px] text-[#7A6F62] pt-1">
                Parcele suas compras em até 6x sem juros no cartão de crédito.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Discreet Admin Access */}
        <div className="pt-8 border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6F62]">
          <p>
            © {new Date().getFullYear()} Aura Semijóias. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-5">
            <span>Termos de Uso</span>
            <span>Privacidade</span>

            {/* Discreet Admin Link requested by user */}
            <button
              id="discreet-admin-footer-link"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#A69B89] hover:text-[#967012] transition-colors py-1 px-2 rounded-md hover:bg-[#F2ECE0]/60 cursor-pointer"
              title="Painel Administrativo do Lojista"
            >
              <Key className="w-3 h-3 text-[#A69B89] hover:text-[#967012]" />
              <span className="opacity-80 hover:opacity-100">Área do Lojista</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
