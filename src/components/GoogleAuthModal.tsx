import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuraLogo } from './AuraLogo';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isCheckoutTriggered?: boolean;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isCheckoutTriggered = true
}) => {
  const { loginWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'prompt' | 'profile'>('prompt');

  // Editable customer data initialized with Google defaults
  const [formData, setFormData] = useState({
    name: user?.name || 'Ana Paula Silveira',
    email: user?.email || 'anapaula.aura@gmail.com',
    phone: user?.phone || '(11) 98122-3344',
    cep: user?.address?.cep || '01414-001',
    street: user?.address?.street || 'Alameda Lorena',
    number: user?.address?.number || '1420',
    complement: user?.address?.complement || 'Apto 82',
    neighborhood: user?.address?.neighborhood || 'Jardins',
    city: user?.address?.city || 'São Paulo',
    state: user?.address?.state || 'SP'
  });

  if (!isOpen) return null;

  const handleGoogleQuickAuth = async () => {
    setLoading(true);
    // Simulate real Google OAuth prompt exchange
    setTimeout(() => {
      setLoading(false);
      setStep('profile');
    }, 600);
  };

  const handleSaveAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithGoogle({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state
      }
    });
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="google-auth-modal"
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#EDE5D3] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close */}
        <button
          id="close-auth-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-gray-700 border border-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner */}
        <div className="bg-[#FAF9F5] p-6 border-b border-[#EDE5D3] text-center">
          <div className="flex justify-center mb-3">
            <AuraLogo size="md" />
          </div>
          <h2 className="text-xl font-bold font-serif-luxury text-[#1C1815]">
            {isCheckoutTriggered ? 'Cadastre-se com o Google para Finalizar' : 'Acesse sua Conta Aura'}
          </h2>
          <p className="text-xs text-[#6B6154] mt-1 max-w-sm mx-auto">
            Garantia de 1 ano, rastreamento VIP em tempo real e checkout seguro com Stripe.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {step === 'prompt' ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/40 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8 text-[#B88E1C]" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#1C1815]">
                  Conexão Rápida e Segura com sua Conta Google
                </p>
                <p className="text-xs text-[#7A6F62] leading-relaxed">
                  Para emitir sua nota fiscal de garantia e vincular seu pedido ao Stripe, faça login com sua conta do Google com apenas um clique.
                </p>
              </div>

              {/* Real Google Button Styling */}
              <button
                id="google-signin-action-btn"
                onClick={handleGoogleQuickAuth}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer group"
              >
                {/* Official Google SVG Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{loading ? 'Conectando ao Google...' : 'Continuar com o Google'}</span>
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#7A6F62]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Seus dados são protegidos por criptografia de ponta a ponta</span>
              </div>
            </div>
          ) : (
            /* Confirm and complete address details */
            <form onSubmit={handleSaveAndContinue} className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Google Conectado com Sucesso!</p>
                  <p className="text-[11px] text-emerald-700">
                    Confirme seus dados e o endereço para entrega das suas semijóias.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">E-mail Google</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Celular / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">CEP de Entrega</label>
                  <input
                    type="text"
                    required
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    placeholder="01414-001"
                    className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">Endereço (Rua/Avenida)</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Número</label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Complemento</label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    placeholder="Apto, Bloco (opcional)"
                    className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Bairro</label>
                  <input
                    type="text"
                    required
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Cidade</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">UF</label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-[#FAF9F5] border border-gray-300 focus:border-[#D4AF37] rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-4 rounded-xl gold-gradient hover:opacity-95 text-[#1C1815] font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {loading ? 'Salvando...' : 'Confirmar e Ir para Pagamento Stripe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
