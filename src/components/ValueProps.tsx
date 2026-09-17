import React from 'react';
import { Truck, Shield, RotateCcw, CreditCard, Sparkles } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      icon: <Truck className="w-5 h-5 text-[#B88E1C]" />,
      title: 'Frete Grátis Brasil',
      desc: 'Em compras acima de R$ 299 com envio expresso'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#B88E1C]" />,
      title: '10 Milésimos Ouro 18k',
      desc: 'Camada nobre superior com verniz hipoalergênico'
    },
    {
      icon: <Shield className="w-5 h-5 text-[#B88E1C]" />,
      title: '1 Ano de Garantia',
      desc: 'Certificado de garantia e autenticidade da peça'
    },
    {
      icon: <CreditCard className="w-5 h-5 text-[#B88E1C]" />,
      title: 'Pagamento Seguro Stripe',
      desc: 'Até 6x sem juros ou desconto no Pix'
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-[#B88E1C]" />,
      title: 'Primeira Troca Grátis',
      desc: 'Até 30 dias para troca sem complicações'
    }
  ];

  return (
    <section className="bg-white border-b border-[#EDE5D3] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {props.map((prop, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-3.5 rounded-xl bg-[#FAF9F5] border border-[#F0EAE0] hover:border-[#D4AF37]/50 transition-all hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-[#FAF3E0] flex items-center justify-center shrink-0 shadow-2xs">
                {prop.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#1C1815] leading-tight">
                  {prop.title}
                </h4>
                <p className="text-[11px] text-[#6B6154] mt-0.5 leading-snug">
                  {prop.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
