import React, { useState, useEffect } from 'react';
import { X, Save, ClipboardCheck } from 'lucide-react';
import type { Condicionante, Licenca } from '@/shared/types';
import { centros, initialLicencas } from '@/shared/data';

interface NovaCondicionanteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (condicionante: Condicionante) => void;
  licencas?: Licenca[];
}

export function NovaCondicionanteModal({ open, onClose, onSave, licencas = initialLicencas }: NovaCondicionanteModalProps) {
  const [titulo, setTitulo] = useState('');
  const [centroId, setCentroId] = useState(centros[0]?.id || 'cd-sp');
  const [licencaId, setLicencaId] = useState(licencas[0]?.id || 'lic-1');
  const [responsavel, setResponsavel] = useState('Marina Azevedo');
  const [prazo, setPrazo] = useState('');
  const [recorrencia, setRecorrencia] = useState('Anual');
  const [status, setStatus] = useState<Condicionante['status']>('Pendente');

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

  // Filter licenses by selected center
  const availableLicenses = licencas.filter((l) => l.centroId === centroId);

  useEffect(() => {
    if (availableLicenses.length > 0 && !availableLicenses.some((l) => l.id === licencaId)) {
      setLicencaId(availableLicenses[0].id);
    }
  }, [centroId, availableLicenses, licencaId]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !prazo) return;

    const nova: Condicionante = {
      id: `con-${Date.now()}`,
      titulo,
      centroId,
      licencaId,
      responsavel,
      prazo,
      recorrencia,
      status,
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

        <form onSubmit={handleSubmit}>
          <div className="drawer-content" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(85vh - 130px)', overflowY: 'auto' }}>
            <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Obrigação / Descrição da Condicionante</span>
              <textarea
                rows={2}
                placeholder="Ex: Enviar relatório semestral de monitoramento de efluentes"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px', resize: 'vertical' }}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unidade</span>
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

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Licença de Origem</span>
                <select
                  value={licencaId}
                  onChange={(e) => setLicencaId(e.target.value)}
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
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Responsável</span>
                <input
                  type="text"
                  placeholder="Nome do responsável"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  required
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prazo Limite</span>
                <input
                  type="date"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  required
                  style={{ height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recorrência</span>
                <select
                  value={recorrencia}
                  onChange={(e) => setRecorrencia(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Única">Única</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                  <option value="Bienal">Bienal</option>
                </select>
              </label>

              <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#688275', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status Inicial</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #dbe2dd', background: '#fff', fontSize: '13px' }}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Concluída">Concluída</option>
                </select>
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
