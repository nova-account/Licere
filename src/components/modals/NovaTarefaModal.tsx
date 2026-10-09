import React, { useEffect } from 'react';
import { X, Save, ListTodo } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Condicionante } from '@/shared/types';
import { useAppData } from '@/lib/AppDataContext';
import { condicionanteFormSchema } from '@/shared/schemas';

type NovaTarefaFormData = z.infer<typeof condicionanteFormSchema>;

interface NovaTarefaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (tarefa: Condicionante) => void;
}

export function NovaTarefaModal({ open, onClose, onSave }: NovaTarefaModalProps) {
  const { centros, licencas } = useAppData();
  const activeCentros = centros.filter((c) => c.status === 'Ativa');
  const defaultCentro = activeCentros[0] || centros[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NovaTarefaFormData>({
    resolver: zodResolver(condicionanteFormSchema),
    defaultValues: {
      titulo: '',
      centroId: defaultCentro?.id || '',
      licencaId: licencas.filter((l) => l.centroId === (defaultCentro?.id || ''))[0]?.id || licencas[0]?.id || '',
      responsavel: defaultCentro?.responsavel || '',
      prazo: '',
      recorrencia: 'Semanal',
      status: 'Pendente',
    },
  });

  const centroId = watch('centroId');
  const availableLicenses = licencas.filter((l) => l.centroId === centroId);
  const licencaId = watch('licencaId');

  useEffect(() => {
    if (defaultCentro) {
      setValue('centroId', defaultCentro.id);
      if (defaultCentro.responsavel) {
        setValue('responsavel', defaultCentro.responsavel);
      }
    }
  }, [defaultCentro, setValue]);

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
      reset();
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, reset]);

  if (!open) return null;

  const onSubmit = (data: NovaTarefaFormData) => {
    const nova: Condicionante = {
      id: `tar-${Date.now()}`,
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
              <ListTodo size={18} />
            </span>
            <div>
              <p className="eyebrow">Gestão de Tarefas</p>
              <h2 style={{ fontSize: '17px', margin: 0 }}>Nova Tarefa</h2>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="drawer-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(85vh - 130px)', overflowY: 'auto' }}>
            
            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                O que precisa ser feito? <span style={{ color: '#e53e3e' }}>*</span>
              </span>
              <input
                type="text"
                placeholder="Ex: Atualizar laudo de ruído perimetral"
                {...register('titulo')}
                style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
              />
              {errors.titulo && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px' }}>{errors.titulo.message}</span>}
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Unidade <span style={{ color: '#e53e3e' }}>*</span>
                </span>
                <select
                  {...register('centroId')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {activeCentros.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                {errors.centroId && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px' }}>{errors.centroId.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Licença de Origem
                </span>
                <select
                  {...register('licencaId')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {availableLicenses.length > 0 ? (
                    availableLicenses.map((l) => (
                      <option key={l.id} value={l.id}>{l.tipo} · {l.numero}</option>
                    ))
                  ) : (
                    <option value="">Nenhuma licença vinculada</option>
                  )}
                </select>
                {errors.licencaId && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px' }}>{errors.licencaId.message}</span>}
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Responsável Operacional <span style={{ color: '#e53e3e' }}>*</span>
                </span>
                <input
                  type="text"
                  placeholder="Nome do responsável"
                  {...register('responsavel')}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
                {errors.responsavel && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px' }}>{errors.responsavel.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Data Limite <span style={{ color: '#e53e3e' }}>*</span>
                </span>
                <input
                  type="date"
                  {...register('prazo')}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
                {errors.prazo && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px' }}>{errors.prazo.message}</span>}
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
                  <option value="Semanal">Semanal</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
                {errors.recorrencia && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px' }}>{errors.recorrencia.message}</span>}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status Inicial</span>
                <select
                  {...register('status')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
                {errors.status && <span style={{ color: '#e53e3e', fontSize: '11px', marginTop: '2px' }}>{errors.status.message}</span>}
              </label>
            </div>

          </div>

          <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '14px 24px', borderTop: '1px solid #edf1ee', background: '#fbfcfb' }}>
            <button type="button" className="quiet-btn" onClick={onClose} style={{ height: '38px', padding: '0 18px', fontSize: '13px', fontWeight: 500, color: '#4a5d53' }}>
              Cancelar
            </button>
            <button type="submit" className="primary-btn" style={{ height: '38px', padding: '0 18px' }}>
              <Save size={15} /> Criar tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
