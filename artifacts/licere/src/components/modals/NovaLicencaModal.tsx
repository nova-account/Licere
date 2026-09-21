import React, { useState, useEffect } from 'react';
import { X, Save, ShieldCheck } from 'lucide-react';
import type { Licenca } from '@/shared/types';
import { centros } from '@/shared/data';

interface NovaLicencaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (licenca: Licenca) => void;
}

export function NovaLicencaModal({ open, onClose, onSave }: NovaLicencaModalProps) {
  const [tipo, setTipo] = useState('Licença de Operação');
  const [numero, setNumero] = useState('');
  const [centroId, setCentroId] = useState(centros[0]?.id || 'cd-sp');
  const [orgao, setOrgao] = useState('CETESB');
  const [emissao, setEmissao] = useState(new Date().toISOString().split('T')[0]);
  const [vencimento, setVencimento] = useState('');
  const [criticidade, setCriticidade] = useState<'Alta' | 'Média' | 'Baixa'>('Média');
  const [status, setStatus] = useState<Licenca['status']>('Vigente');
  const [observacao, setObservacao] = useState('');

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
    if (!numero.trim() || !vencimento) return;

    const nova: Licenca = {
      id: `lic-${Date.now()}`,
      numero,
      tipo,
      centroId,
      orgao,
      emissao,
      vencimento,
      status,
      criticidade,
      observacao,
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

        <form onSubmit={handleSubmit}>
          <div className="drawer-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(85vh - 130px)', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tipo de Licença</span>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Licença de Operação">Licença de Operação (LO)</option>
                  <option value="Licença de Instalação">Licença de Instalação (LI)</option>
                  <option value="Licença Prévia">Licença Prévia (LP)</option>
                  <option value="Licença Ambiental de Operação">Licença Ambiental de Operação (LAO)</option>
                  <option value="Outorga de captação">Outorga de captação</option>
                  <option value="Dispensa de Licenciamento">Dispensa de Licenciamento</option>
                </select>
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Número / Identificação</span>
                <input
                  type="text"
                  placeholder="Ex: CETESB 48001234"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unidade</span>
                <select
                  value={centroId}
                  onChange={(e) => setCentroId(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  {centros.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome} ({c.estado})</option>
                  ))}
                </select>
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Órgão Ambiental</span>
                <input
                  type="text"
                  placeholder="Ex: CETESB, IBAMA"
                  value={orgao}
                  onChange={(e) => setOrgao(e.target.value)}
                  required
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Data de Emissão</span>
                <input
                  type="date"
                  value={emissao}
                  onChange={(e) => setEmissao(e.target.value)}
                  required
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Data de Vencimento</span>
                <input
                  type="date"
                  value={vencimento}
                  onChange={(e) => setVencimento(e.target.value)}
                  required
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Criticidade</span>
                <select
                  value={criticidade}
                  onChange={(e) => setCriticidade(e.target.value as any)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status Inicial</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Vigente">Vigente</option>
                  <option value="A vencer">A vencer</option>
                  <option value="Regular">Regular</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Vencida">Vencida</option>
                </select>
              </label>
            </div>

            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Observações / Condições gerais</span>
              <textarea
                rows={2}
                placeholder="Ex: Protocolar renovação 120 dias antes do vencimento."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px', resize: 'vertical' }}
              />
            </label>
          </div>

          <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '14px 24px', borderTop: '1px solid #edf1ee', background: '#fbfcfb' }}>
            <button type="submit" className="primary-btn" style={{ height: '38px', padding: '0 18px' }}>
              <Save size={15} /> Cadastrar licença
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
