import React, { useEffect } from 'react';
import { X, Save, ClipboardCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Condicionante, Licenca } from '@/shared/types';
import { condicionanteFormSchema } from '@/shared/schemas';
import { useAppData } from '@/lib/AppDataContext';

type NovaCondicionanteFormData = z.infer<typeof condicionanteFormSchema>;

interface NovaCondicionanteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (condicionante: Condicionante) => void;
  licencas?: Licenca[];
}

export function NovaCondicionanteModal({ open, onClose, onSave, licencas: propLicencas }: NovaCondicionanteModalProps) {
  const { centros, licencas: storeLicencas } = useAppData();
  const licencas = propLicencas || storeLicencas;
  const activeCentros = centros.filter((c) => c.status === 'Ativa');
  const defaultCentro = activeCentros[0] || centros[0];
  const defaultCentroId = defaultCentro?.id || '';
  const initialLicenses = licencas.filter((l) => l.centroId === defaultCentroId);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NovaCondicionanteFormData>({
    resolver: zodResolver(condicionanteFormSchema),
    defaultValues: {
      titulo: '',
      centroId: defaultCentroId,
      licencaId: initialLicenses[0]?.id || licencas[0]?.id || '',
      responsavel: defaultCentro?.responsavel || '',
      prazo: '',
      recorrencia: 'Anual',
      status: 'Pendente',
    },
  });

  const centroId = watch('centroId');
  const availableLicenses = licencas.filter((l) => l.centroId === centroId);
  const licencaId = watch('licencaId');

  useEffect(() => {
    if (availableLicenses.length > 0 && !availableLicenses.some((l) => l.id === licencaId)) {
      setValue('licencaId', availableLicenses[0].id);
    }
    const selected = centros.find((c) => c.id === centroId);
    if (selected?.responsavel) {
      setValue('responsavel', selected.responsavel);
    }
  }, [centroId, centros, availableLicenses, licencaId, setValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      reset(); // Reset form on close
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, reset]);

  if (!open) return null;

  const onSubmit = (data: NovaCondicionanteFormData) => {
    const nova: Condicionante = {
      id: `con-${Date.now()}`,
      ...data,
    };
    onSave(nova);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="quick-modal animate-rise" style={{ maxWidth: '540px', width: '100%' }}>
        <div className="drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="document-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(36, 91, 69, 0.1)', color: '#245b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardCheck size={18} />
            </span>
            <div>
              <p className="eyebrow">Obrigação Ambiental</p>
              <h2 style={{ fontSize: '17px', margin: 0 }}>Nova Condicionante</h2>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="drawer-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(85vh - 130px)', overflowY: 'auto' }}>
            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Obrigação / Descrição da Condicionante</span>
              <textarea
                rows={2}
                placeholder="Ex: Enviar relatório semestral de monitoramento de efluentes"
                {...register('titulo')}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px', resize: 'vertical' }}
              />
              {errors.titulo && <span style={{ color: 'red', fontSize: '11px' }}>{errors.titulo.message}</span>}
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unidade</span>
                <select
                  {...register('centroId')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {centros.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                {errors.centroId && <span style={{ color: 'red', fontSize: '11px' }}>{errors.centroId.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Licença de Origem</span>
                <select
                  {...register('licencaId')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {availableLicenses.length > 0 ? (
                    availableLicenses.map((l) => (
                      <option key={l.id} value={l.id}>{l.tipo} · {l.numero}</option>
                    ))
                  ) : (
                    <option value="">Nenhuma licença na unidade</option>
                  )}
                </select>
                {errors.licencaId && <span style={{ color: 'red', fontSize: '11px' }}>{errors.licencaId.message}</span>}
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Responsável</span>
                <input
                  type="text"
                  placeholder="Nome do responsável"
                  {...register('responsavel')}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
                {errors.responsavel && <span style={{ color: 'red', fontSize: '11px' }}>{errors.responsavel.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prazo Limite</span>
                <input
                  type="date"
                  {...register('prazo')}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
                {errors.prazo && <span style={{ color: 'red', fontSize: '11px' }}>{errors.prazo.message}</span>}
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recorrência</span>
                <select
                  {...register('recorrencia')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Única">Única</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                  <option value="Bienal">Bienal</option>
                </select>
                {errors.recorrencia && <span style={{ color: 'red', fontSize: '11px' }}>{errors.recorrencia.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status Inicial</span>
                <select
                  {...register('status')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Concluída">Concluída</option>
                </select>
                {errors.status && <span style={{ color: 'red', fontSize: '11px' }}>{errors.status.message}</span>}
              </label>
            </div>
          </div>

          <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '14px 24px', borderTop: '1px solid #edf1ee', background: '#fbfcfb' }}>
            <button type="submit" className="primary-btn" style={{ height: '38px', padding: '0 18px' }}>
              <Save size={15} /> Cadastrar obrigação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
