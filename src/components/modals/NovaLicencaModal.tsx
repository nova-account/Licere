import React, { useEffect } from 'react';
import { X, Save, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Licenca } from '@/shared/types';
import { useAppData } from '@/lib/AppDataContext';
import { licencaFormSchema } from '@/shared/schemas';

type NovaLicencaFormData = z.infer<typeof licencaFormSchema>;

interface NovaLicencaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (licenca: Licenca) => void;
}

export function NovaLicencaModal({ open, onClose, onSave }: NovaLicencaModalProps) {
  const { centros } = useAppData();
  const activeCentros = centros.filter((c) => c.status === 'Ativa');
  const defaultCentroId = activeCentros[0]?.id || centros[0]?.id || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NovaLicencaFormData>({
    resolver: zodResolver(licencaFormSchema),
    defaultValues: {
      tipo: 'Licença de Operação',
      numero: '',
      centroId: defaultCentroId,
      orgao: 'CETESB',
      emissao: new Date().toISOString().split('T')[0],
      vencimento: '',
      criticidade: 'Média',
      status: 'Vigente',
      observacao: '',
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      reset();
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, reset]);

  if (!open) return null;

  const onSubmit = (data: NovaLicencaFormData) => {
    const nova: Licenca = {
      id: `lic-${Date.now()}`,
      ...data,
    };
    onSave(nova);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="quick-modal animate-rise" style={{ maxWidth: '560px', width: '100%' }}>
        <div className="drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="document-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(36, 91, 69, 0.1)', color: '#245b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="eyebrow">Cadastro de Licença</p>
              <h2 style={{ fontSize: '17px', margin: 0 }}>Nova Licença Ambiental</h2>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="drawer-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(85vh - 130px)', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tipo de Licença <span style={{ color: '#e53e3e' }}>*</span></span>
                <select
                  {...register('tipo')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Licença de Operação">Licença de Operação (LO)</option>
                  <option value="Licença de Instalação">Licença de Instalação (LI)</option>
                  <option value="Licença Prévia">Licença Prévia (LP)</option>
                  <option value="Licença Ambiental de Operação">Licença Ambiental de Operação (LAO)</option>
                  <option value="Outorga de captação">Outorga de captação</option>
                  <option value="Dispensa de Licenciamento">Dispensa de Licenciamento</option>
                </select>
                {errors.tipo && <span style={{ color: '#e53e3e', fontSize: '11px' }}>{errors.tipo.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Número / Identificação <span style={{ color: '#e53e3e' }}>*</span></span>
                <input
                  type="text"
                  placeholder="Ex: CETESB 48001234"
                  {...register('numero')}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
                {errors.numero && <span style={{ color: '#e53e3e', fontSize: '11px' }}>{errors.numero.message}</span>}
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unidade <span style={{ color: '#e53e3e' }}>*</span></span>
                <select
                  {...register('centroId')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {centros.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome} ({c.estado})</option>
                  ))}
                </select>
                {errors.centroId && <span style={{ color: '#e53e3e', fontSize: '11px' }}>{errors.centroId.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Órgão Ambiental <span style={{ color: '#e53e3e' }}>*</span></span>
                <input
                  type="text"
                  placeholder="Ex: CETESB, IBAMA"
                  {...register('orgao')}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
                {errors.orgao && <span style={{ color: '#e53e3e', fontSize: '11px' }}>{errors.orgao.message}</span>}
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Data de Emissão <span style={{ color: '#e53e3e' }}>*</span></span>
                <input
                  type="date"
                  {...register('emissao')}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
                {errors.emissao && <span style={{ color: '#e53e3e', fontSize: '11px' }}>{errors.emissao.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Data de Vencimento <span style={{ color: '#e53e3e' }}>*</span></span>
                <input
                  type="date"
                  {...register('vencimento')}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
                {errors.vencimento && <span style={{ color: '#e53e3e', fontSize: '11px' }}>{errors.vencimento.message}</span>}
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Criticidade</span>
                <select
                  {...register('criticidade')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
                {errors.criticidade && <span style={{ color: '#e53e3e', fontSize: '11px' }}>{errors.criticidade.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status Inicial</span>
                <select
                  {...register('status')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Vigente">Vigente</option>
                  <option value="A vencer">A vencer</option>
                  <option value="Regular">Regular</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Vencida">Vencida</option>
                </select>
                {errors.status && <span style={{ color: '#e53e3e', fontSize: '11px' }}>{errors.status.message}</span>}
              </label>
            </div>

            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Observações / Condições gerais</span>
              <textarea
                rows={2}
                placeholder="Ex: Protocolar renovação 120 dias antes do vencimento."
                {...register('observacao')}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px', resize: 'vertical' }}
              />
              {errors.observacao && <span style={{ color: '#e53e3e', fontSize: '11px' }}>{errors.observacao.message}</span>}
            </label>
          </div>

          <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '14px 24px', borderTop: '1px solid #edf1ee', background: '#fbfcfb' }}>
            <button type="button" className="quiet-btn" onClick={onClose} style={{ height: '38px', padding: '0 18px', fontSize: '13px', fontWeight: 500, color: '#4a5d53' }}>
              Cancelar
            </button>
            <button type="submit" className="primary-btn" style={{ height: '38px', padding: '0 18px' }}>
              <Save size={15} /> Cadastrar licença
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
