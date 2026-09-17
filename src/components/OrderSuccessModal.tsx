import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Sparkles, Package, ExternalLink, MessageCircle, X } from 'lucide-react';
import { Order } from '../types';
import { AuraLogo } from './AuraLogo';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  useEffect(() => {
    if (order) {
      // Opulent celebratory gold and white confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F3E5AB', '#FAF9F5', '#AA7C11']
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#D4AF37', '#F3E5AB']
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#D4AF37', '#F3E5AB']
        });
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [order]);

  if (!order) return null;

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const whatsappMessage = encodeURIComponent(
    `Olá, Aura Semijóias! Acabei de realizar o pedido #${order.id} no valor de ${formatBRL(order.total)}. Gostaria de acompanhar!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="order-success-modal"
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#EDE5D3] overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-gray-700 border border-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Banner */}
        <div className="bg-[#FAF9F5] p-6 border-b border-[#EDE5D3] flex flex-col items-center">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center shadow-lg mb-3">
            <CheckCircle className="w-9 h-9 text-[#1C1815]" />
          </div>
          <AuraLogo size="sm" showSubtitle={false} />
          <h2 className="text-xl font-bold font-serif-luxury text-[#1C1815] mt-2">
            Pedido Realizado com Sucesso!
          </h2>
          <p className="text-xs text-[#7A6F62] mt-1">
            Pagamento confirmado com Stripe • Pedido <strong className="text-[#1C1815]">#{order.id}</strong>
          </p>
        </div>

        {/* Order Details */}
        <div className="p-6 space-y-4 text-left">
          <div className="p-4 rounded-xl bg-[#FAF6EC] border border-[#D4AF37]/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Comprador:</span>
              <span className="font-semibold text-[#1C1815]">{order.customer.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Envio selecionado:</span>
              <span className="font-semibold text-[#1C1815]">{order.shippingOption.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Código de Rastreio Inicial:</span>
              <span className="font-mono font-bold text-[#967012]">{order.trackingCode}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#D4AF37]/30 text-sm font-bold">
              <span className="text-[#1C1815]">Total Pago:</span>
              <span className="text-[#967012]">{formatBRL(order.total)}</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1">
            <span className="font-semibold text-[#1C1815] block">Endereço de Entrega:</span>
            <p className="text-gray-600">
              {order.customer.address?.street}, {order.customer.address?.number} - {order.customer.address?.neighborhood}, {order.customer.address?.city}/{order.customer.address?.state} - CEP {order.customer.address?.cep}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/5511999999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Acompanhar pelo WhatsApp Aura VIP</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#D4AF37] text-[#1C1815] font-semibold text-xs transition-colors"
            >
              Continuar Navegando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
