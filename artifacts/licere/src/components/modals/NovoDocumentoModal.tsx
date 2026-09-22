import React, { useState, useEffect } from 'react';
import { X, Save, FolderOpen, UploadCloud } from 'lucide-react';
import type { Documento } from '@/shared/types';
import { centros, initialLicencas } from '@/shared/data';

interface NovoDocumentoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (documento: Documento) => void;
}

export function NovoDocumentoModal({ open, onClose, onSave }: NovoDocumentoModalProps) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<'Relatórios' | 'Licenças' | 'Protocolos' | 'Plantas' | 'Laudos'>('Relatórios');
  const [centroId, setCentroId] = useState(centros[0]?.id || 'cd-sp');
  const [validade, setValidade] = useState('2026-12-31');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const novo: Documento = {
      id: `doc-${Date.now()}`,
      nome: nome.endsWith('.pdf') ? nome : `${nome}.pdf`,
      categoria,
      centroId,
      licencaId: initialLicencas.find((l) => l.centroId === centroId)?.id,
      tamanho: '2.1 MB',
      atualizadoEm: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      validade: validade || 'Permanente',
    };

    onSave(novo);
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

        <form onSubmit={handleSubmit}>
          <div className="drawer-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nome do Arquivo ou Documento</span>
              <input
                type="text"
                placeholder="Ex: Laudo_Analise_Agua_2025.pdf"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Categoria</span>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as any)}
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
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unidade Vinculada</span>
                <select
                  value={centroId}
                  onChange={(e) => setCentroId(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {centros.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Validade do Documento</span>
              <input
                type="date"
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
              />
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
