import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import type { Centro } from '@/shared/types';

interface NovaUnidadeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (unidade: Centro) => void;
}

export function NovaUnidadeModal({ open, onClose, onSave }: NovaUnidadeModalProps) {
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SP');
  const [responsavel, setResponsavel] = useState('');
  const [status, setStatus] = useState<Centro['status']>('Operando');

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
    if (!nome.trim() || !cidade.trim()) return;

    const nova: Centro = {
      id: `cd-${Date.now()}`,
      nome,
      cidade,
      estado,
      responsavel: responsavel || 'Não definido',
      status,
    };

    onSave(nova);
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

        <form onSubmit={handleSubmit}>
          <div className="drawer-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nome da Unidade</span>
              <input
                type="text"
                placeholder="Ex: CD Campinas, Filial Curitiba"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Município</span>
                <input
                  type="text"
                  placeholder="Ex: Campinas"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>UF</span>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {['SP', 'MG', 'RJ', 'SC', 'PR', 'RS', 'GO', 'BA', 'ES', 'PE'].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Responsável Técnico/Operacional</span>
                <input
                  type="text"
                  placeholder="Nome do gestor"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  required
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status Inicial</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Operando">Operando</option>
                  <option value="Em expansão">Em expansão</option>
                  <option value="Em implantação">Em implantação</option>
                </select>
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
