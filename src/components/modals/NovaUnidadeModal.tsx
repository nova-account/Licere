import React, { useEffect } from 'react';
import { X, Save, Building2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Centro } from '@/shared/types';
import { centroFormSchema } from '@/shared/schemas';

type NovaUnidadeFormData = z.infer<typeof centroFormSchema>;

interface NovaUnidadeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (unidade: Centro) => void;
}

export function NovaUnidadeModal({ open, onClose, onSave }: NovaUnidadeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NovaUnidadeFormData>({
    resolver: zodResolver(centroFormSchema),
    defaultValues: {
      nome: '',
      cidade: '',
      estado: 'SP',
      responsavel: '',
      status: 'Ativa',
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

  const onSubmit = (data: NovaUnidadeFormData) => {
    const nova: Centro = {
      id: `cd-${Date.now()}`,
      ...data,
    };

    onSave(nova);
    reset();
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="quick-modal animate-rise" style={{ maxWidth: '520px', width: '100%' }}>
        <div className="drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="document-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(36, 91, 69, 0.1)', color: '#245b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} />
            </span>
            <div>
              <p className="eyebrow">Rede Operacional</p>
              <h2 style={{ fontSize: '17px', margin: 0 }}>Nova Unidade</h2>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="drawer-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nome da Unidade</span>
              <input
                type="text"
                placeholder="Ex: CD Campinas, Filial Curitiba"
                {...register('nome')}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: errors.nome ? '1px solid #b02a37' : '1px solid #dbe2dd',
                  background: errors.nome ? '#fffbfb' : '#fff',
                  fontSize: '13px',
                }}
              />
              {errors.nome && (
                <span style={{ color: '#b02a37', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.nome.message}
                </span>
              )}
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Município</span>
                <input
                  type="text"
                  placeholder="Ex: Campinas"
                  {...register('cidade')}
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: errors.cidade ? '1px solid #b02a37' : '1px solid #dbe2dd',
                    background: errors.cidade ? '#fffbfb' : '#fff',
                    fontSize: '13px',
                  }}
                />
                {errors.cidade && (
                  <span style={{ color: '#b02a37', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.cidade.message}
                  </span>
                )}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>UF</span>
                <select
                  {...register('estado')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {['SP', 'MG', 'RJ', 'SC', 'PR', 'RS', 'GO', 'BA', 'ES', 'PE'].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                {errors.estado && (
                  <span style={{ color: '#b02a37', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.estado.message}
                  </span>
                )}
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Responsável Técnico/Operacional</span>
                <input
                  type="text"
                  placeholder="Nome do gestor"
                  {...register('responsavel')}
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: errors.responsavel ? '1px solid #b02a37' : '1px solid #dbe2dd',
                    background: errors.responsavel ? '#fffbfb' : '#fff',
                    fontSize: '13px',
                  }}
                />
                {errors.responsavel && (
                  <span style={{ color: '#b02a37', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.responsavel.message}
                  </span>
                )}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status Inicial</span>
                <select
                  {...register('status')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                </select>
                {errors.status && (
                  <span style={{ color: '#b02a37', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.status.message}
                  </span>
                )}
              </label>
            </div>
          </div>

          <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '14px 24px', borderTop: '1px solid #edf1ee', background: '#fbfcfb' }}>
            <button type="submit" className="primary-btn" style={{ height: '38px', padding: '0 18px' }}>
              <Save size={15} /> Cadastrar unidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
