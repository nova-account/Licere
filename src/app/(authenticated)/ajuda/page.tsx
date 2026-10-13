'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronDown,
  FileCheck2,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/shared/ui';
import { cn } from '@/lib/utils';

const modules = [
  {
    icon: Building2,
    title: 'Unidades',
    description:
      'Cadastre filiais e centros de distribuição. Cada unidade centraliza seus responsáveis técnicos, licenças e pendências.',
    href: '/unidades',
    actionLabel: 'Ver unidades',
  },
  {
    icon: ShieldCheck,
    title: 'Licenças Ambientais',
    description:
      'Controle de Licenças Prévias, de Instalação e de Operação. Monitore vencimentos, renovações e níveis de criticidade.',
    href: '/licencas',
    actionLabel: 'Ver licenças',
  },
  {
    icon: BookOpen,
    title: 'Tarefas e Condicionantes',
    description:
      'Acompanhe obrigações periódicas dos anexos da licença com prazos, responsáveis e envio de evidências.',
    href: '/tarefas',
    actionLabel: 'Ver tarefas',
  },
  {
    icon: FileCheck2,
    title: 'Documentos e Laudos',
    description:
      'Acervo digital com relatórios de efluentes, laudos de ruído, PGRS e manifestos indexados para fiscalização.',
    href: '/documentos',
    actionLabel: 'Ver documentos',
  },
];

const faqs = [
  {
    question: 'Como funciona a regra de cálculo de criticidade das licenças?',
    answer:
      'O sistema avalia automaticamente os prazos: licenças com vencimento inferior a 60 dias ou suspensas recebem criticidade Alta. Prazos entre 60 e 180 dias recebem criticidade Média, e acima de 180 dias são classificadas como Baixa.',
  },
  {
    question: 'Por que o sistema bloqueia a exclusão de uma unidade?',
    answer:
      'Para garantir a conformidade legal e proteger o histórico exigido por órgãos ambientais, uma unidade só pode ser excluída se não possuir documentos pendentes/expirados ou tarefas não concluídas.',
  },
  {
    question: 'Qual o prazo legal para protocolar renovação de licenças?',
    answer:
      'Conforme a Lei Complementar 140/2011, pedidos de renovação de Licença de Operação (LO) devem ser protocolados no órgão ambiental competente com antecedência mínima de 120 dias do vencimento para prorrogação automática da validade.',
  },
  {
    question: 'Como comprovar cumprimento de condicionantes em fiscalizações?',
    answer:
      'Todos os laudos e comprovantes vinculados às tarefas ficam arquivados com data, responsável e hash de documento. Você pode visualizá-los diretamente na aba de Documentos ou no painel lateral de detalhes da unidade.',
  },
];

export default function AjudaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="content animate-rise">
      <PageHeader eyebrow="Central de ajuda" title="Como podemos ajudar?" />
      <p className="page-description">
        Consulte o funcionamento dos módulos operacionais ou entre em contato com a equipe de
        suporte e compliance da Licere.
      </p>

      {/* Grid de Módulos Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {modules.map(({ icon: Icon, title, description, href, actionLabel }) => (
          <section
            key={title}
            className="flex flex-col justify-between p-5 bg-white border border-[rgba(16,42,34,0.08)] rounded-[14px] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)]"
          >
            <div>
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#e3efea] text-[#1b6848] mb-3.5">
                <Icon size={18} />
              </span>
              <h2 className="font-display text-[15px] font-bold text-[#1b4032] tracking-[-0.03em] m-0 mb-1.5">
                {title}
              </h2>
              <p className="text-[13px] text-[#648273] leading-relaxed m-0 mb-4">
                {description}
              </p>
            </div>
            <Link href={href} className="text-link pt-3 border-t border-[#e4ebec]">
              {actionLabel} <ArrowRight size={13} />
            </Link>
          </section>
        ))}
      </div>

      {/* Perguntas Frequentes (FAQ) */}
      <section className="mt-9 p-6 bg-white border border-[rgba(16,42,34,0.08)] rounded-[14px] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)]">
        <div className="mb-4">
          <p className="eyebrow !mb-1">Dúvidas frequentes</p>
          <h2 className="font-display text-[17px] font-bold text-[#1b4032] tracking-[-0.04em] m-0">
            Perguntas operacionais
          </h2>
        </div>

        <div className="divide-y divide-[#e4ebec]">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3.5 first:pt-1 last:pb-1">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex items-center justify-between w-full text-left gap-3 bg-transparent border-0 p-0 cursor-pointer select-none transition-none !transform-none"
                >
                  <span
                    className="text-[13px] font-medium text-[#1b4032] hover:text-[#1b6848] transition-colors leading-snug !transform-none"
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      'text-[#809397] shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 text-[#1b6848]',
                    )}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs text-[#648273] leading-relaxed mt-2.5 mb-1 pl-0.5">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contato Oficial Licere — Banner horizontal elegante */}
      <section className="flex items-center justify-between gap-4 p-5 mt-6 bg-gradient-to-r from-white via-white to-[#f7faf8] border border-[rgba(16,42,34,0.08)] rounded-[14px] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)] max-[768px]:flex-col max-[768px]:items-stretch max-[768px]:gap-3.5">
        <div className="flex items-center gap-3.5 text-[#194333]">
          <span className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-[#e7f2ed] border border-[rgba(27,104,72,0.12)] text-[#1b6848] shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Mail size={19} />
          </span>
          <div>
            <b className="block font-display text-[14px] font-bold text-[#173a2d] tracking-tight mb-0.5">
              Ainda precisa de ajuda ou suporte técnico?
            </b>
            <p className="m-0 text-[12px] text-[#5e776a] leading-relaxed">
              Fale com nossa equipe em{' '}
              <a
                href="mailto:suporte@licere.com.br"
                className="text-[#1b6848] font-semibold hover:underline"
              >
                suporte@licere.com.br
              </a>{' '}
              ou pelo telefone{' '}
              <span className="inline-flex items-center font-semibold text-[#183d2f] bg-[#f0f6f3] px-1.5 py-0.5 rounded-[5px] text-[11.5px] border border-[rgba(27,104,72,0.08)]">
                0800 782 5423
              </span>
              .
            </p>
          </div>
        </div>
        <a
          href="mailto:suporte@licere.com.br"
          className="secondary-btn group shrink-0 !h-[38px] !px-4 hover:border-[#b8cfc3] hover:translate-y-0 transition-colors max-[768px]:w-full max-[768px]:justify-center"
        >
          Falar com suporte <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
        </a>
      </section>
    </main>
  );
}