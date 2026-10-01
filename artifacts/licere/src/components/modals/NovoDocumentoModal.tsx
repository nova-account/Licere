import React, { useEffect, useState } from 'react';
import { X, Save, FolderOpen, UploadCloud, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Documento } from '@/shared/types';
import { useAppData } from '@/lib/AppDataContext';

const novoDocumentoSchema = z.object({
  nome: z.string().min(3, 'O nome do documento deve ter pelo menos 3 caracteres.'),
  categoria: z.enum(['Relatórios', 'Licenças', 'Protocolos', 'Plantas', 'Laudos']),
  centroId: z.string().min(1, 'Selecione a unidade correspondente.'),
  validade: z.string().min(1, 'A data de validade é obrigatória.'),
});

type NovoDocumentoFormData = z.infer<typeof novoDocumentoSchema>;

interface NovoDocumentoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (documento: Documento) => void;
}

export function NovoDocumentoModal({ open, onClose, onSave }: NovoDocumentoModalProps) {
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
  } = useForm<NovoDocumentoFormData>({
    resolver: zodResolver(novoDocumentoSchema),
    defaultValues: {
      nome: '',
      categoria: 'Relatórios',
      centroId: defaultCentro?.id || '',
      validade: '2026-12-31',
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

  const onSubmit = (data: NovoDocumentoFormData) => {
    setInactiveError(null);

    const selectedCentro = centros.find((c) => c.id === data.centroId);
    if (selectedCentro?.status === 'Inativa') {
      setInactiveError('Unidades inativas não podem receber novos documentos ou evidências.');
      return;
    }

    const novo: Documento = {
      id: `doc-${Date.now()}`,
      nome: data.nome.endsWith('.pdf') ? data.nome : `${data.nome}.pdf`,
      categoria: data.categoria,
      centroId: data.centroId,
      licencaId: licencas.find((l) => l.centroId === data.centroId)?.id,
      tamanho: '2.1 MB',
      atualizadoEm: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      validade: data.validade || 'Permanente',
    };

    onSave(novo);
    reset();
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="quick-modal animate-rise" style={{ maxWidth: '520px', width: '100%' }}>
        <div className="drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="document-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(36, 91, 69, 0.1)', color: '#245b45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderOpen size={18} />
            </span>
            <div>
              <p className="eyebrow">Repositório Documental</p>
              <h2 style={{ fontSize: '17px', margin: 0 }}>Novo Documento / Evidência</h2>
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
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nome do Arquivo ou Documento</span>
              <input
                type="text"
                placeholder="Ex: Laudo_Analise_Agua_2025.pdf"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Categoria</span>
                <select
                  {...register('categoria')}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Relatórios">Relatórios</option>
                  <option value="Licenças">Licenças</option>
                  <option value="Protocolos">Protocolos</option>
                  <option value="Plantas">Plantas</option>
                  <option value="Laudos">Laudos</option>
                </select>
              </label>

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
            </div>

            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Validade do Documento</span>
              <input
                type="date"
                {...register('validade')}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: errors.validade ? '1px solid #b02a37' : '1px solid #dbe2dd',
                  background: errors.validade ? '#fffbfb' : '#fff',
                  fontSize: '13px',
                }}
              />
              {errors.validade && (
                <span style={{ color: '#b02a37', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.validade.message}
                </span>
              )}
            </label>

            <div style={{ padding: '16px', borderRadius: '8px', border: '1px dashed #c4d4cc', background: '#f8faf9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <UploadCloud size={24} color="#245b45" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#245b45' }}>Clique ou arraste o arquivo PDF aqui</span>
              <span style={{ fontSize: '11px', color: '#7a9186' }}>Formatos aceitos: PDF, DOCX, PNG (máx. 25MB)</span>
            </div>
          </div>

          <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '14px 24px', borderTop: '1px solid #edf1ee', background: '#fbfcfb' }}>
            <button type="submit" className="primary-btn" style={{ height: '38px', padding: '0 18px' }}>
              <Save size={15} /> Fazer upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
