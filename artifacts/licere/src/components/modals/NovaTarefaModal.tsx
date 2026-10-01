import React, { useEffect, useState } from 'react';
import { X, Save, ListTodo, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Condicionante } from '@/shared/types';
import { useAppData } from '@/lib/AppDataContext';

const novaTarefaSchema = z.object({
  titulo: z.string().min(3, 'O título da tarefa deve ter pelo menos 3 caracteres.'),
  centroId: z.string().min(1, 'Selecione a unidade responsável.'),
  responsavel: z.string().min(3, 'O responsável operacional é obrigatório.'),
  prazo: z.string().min(1, 'A data limite é obrigatória.'),
  recorrencia: z.string(),
  status: z.enum(['Pendente', 'Em andamento', 'Concluída']),
});

type NovaTarefaFormData = z.infer<typeof novaTarefaSchema>;

interface NovaTarefaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (tarefa: Condicionante) => void;
}

export function NovaTarefaModal({ open, onClose, onSave }: NovaTarefaModalProps) {
  const { centros, licencas } = useAppData();
  const activeCentros = centros.filter((c) => c.status === 'Ativa');
  const defaultCentro = activeCentros[0] || centros[0];
  const [inactiveError, setInactiveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NovaTarefaFormData>({
    resolver: zodResolver(novaTarefaSchema),
    defaultValues: {
      titulo: '',
      centroId: defaultCentro?.id || '',
      responsavel: 'Marina Azevedo',
      prazo: '',
      recorrencia: 'Semanal',
      status: 'Pendente',
    },
  });

  useEffect(() => {
    if (defaultCentro) {
      setValue('centroId', defaultCentro.id);
    }
  }, [defaultCentro, setValue]);

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
      setInactiveError(null);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, reset]);

  if (!open) return null;

  const onSubmit = (data: NovaTarefaFormData) => {
    setInactiveError(null);

    const selectedCentro = centros.find((c) => c.id === data.centroId);
    if (selectedCentro?.status === 'Inativa') {
      setInactiveError('Unidades inativas não podem receber novas tarefas operacionais.');
      return;
    }

    const nova: Condicionante = {
      id: `task-${Date.now()}`,
      titulo: data.titulo,
      centroId: data.centroId,
      licencaId: licencas.find((l) => l.centroId === data.centroId)?.id || licencas[0]?.id || 'lic-1',
      responsavel: data.responsavel,
      prazo: data.prazo,
      recorrencia: data.recorrencia,
      status: data.status,
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
              <ListTodo size={18} />
            </span>
            <div>
              <p className="eyebrow">Gestão de Tarefas</p>
              <h2 style={{ fontSize: '17px', margin: 0 }}>Nova Tarefa Operacional</h2>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="drawer-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {inactiveError && (
              <div style={{ padding: '10px 12px', background: '#fdeded', border: '1px solid #f5c2c7', borderRadius: '6px', color: '#b02a37', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} />
                <span>{inactiveError}</span>
              </div>
            )}

            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Título da Tarefa</span>
              <input
                type="text"
                placeholder="Ex: Inspecionar ponto de descarte de efluentes"
                {...register('titulo')}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: errors.titulo ? '1px solid #b02a37' : '1px solid #dbe2dd',
                  background: errors.titulo ? '#fffbfb' : '#fff',
                  fontSize: '13px',
                }}
              />
              {errors.titulo && (
                <span style={{ color: '#b02a37', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.titulo.message}
                </span>
              )}
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unidade (Apenas ativas)</span>
                <select
                  {...register('centroId')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {centros.map((c) => (
                    <option key={c.id} value={c.id} disabled={c.status === 'Inativa'}>
                      {c.nome} {c.status === 'Inativa' ? '(Inativa - Bloqueada)' : ''}
                    </option>
                  ))}
                </select>
                {errors.centroId && (
                  <span style={{ color: '#b02a37', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.centroId.message}
                  </span>
                )}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Responsável</span>
                <input
                  type="text"
                  placeholder="Nome do responsável"
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Data Limite</span>
                <input
                  type="date"
                  {...register('prazo')}
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: errors.prazo ? '1px solid #b02a37' : '1px solid #dbe2dd',
                    background: errors.prazo ? '#fffbfb' : '#fff',
                    fontSize: '13px',
                  }}
                />
                {errors.prazo && (
                  <span style={{ color: '#b02a37', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.prazo.message}
                  </span>
                )}
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Periodicidade</span>
                <select
                  {...register('recorrencia')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Única">Pontual (Única)</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quinzenal">Quinzenal</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Trimestral">Trimestral</option>
                </select>
              </label>
            </div>
          </div>

          <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '14px 24px', borderTop: '1px solid #edf1ee', background: '#fbfcfb' }}>
            <button type="submit" className="primary-btn" style={{ height: '38px', padding: '0 18px' }}>
              <Save size={15} /> Cadastrar tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
