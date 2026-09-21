import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Bell, Menu, Search, Plus } from 'lucide-react';

export function Topbar({
  onMenu,
  onQuickAdd,
}: {
  onMenu: () => void;
  onQuickAdd?: () => void;
}) {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  const goSearch = () => {
    const value = search.trim();
    if (!value) return;
    const normalized = value.toLowerCase();
    const path =
      normalized.includes('document') || normalized.includes('evidên')
        ? '/documentos'
        : normalized.includes('tarefa') || normalized.includes('condicion')
          ? '/condicionantes'
          : normalized.includes('unidade') || normalized.includes('cd ')
            ? '/unidades'
            : '/licencas';
    setLocation(`${path}?busca=${encodeURIComponent(value)}`);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu icon-btn" onClick={onMenu} aria-label="abrir menu">
          <Menu size={18} />
        </button>
        <div className="topbar-context">
          <span>Workspace</span>
          <strong>Operações Brasil</strong>
        </div>
      </div>

      <div className="top-actions">
        <label className="global-search">
          <Search size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && goSearch()}
            placeholder="Buscar em tudo"
            aria-label="buscar em tudo"
            data-testid="input-global-search"
          />
        </label>

        <div className="notification-wrap" style={{ display: 'flex', gap: '8px' }}>
          {onQuickAdd && (
            <button
              aria-label="adicionar"
              onClick={onQuickAdd}
              className="icon-btn"
            >
              <Plus size={17} />
            </button>
          )}
          <button
            aria-label="notificações"
            onClick={() => setNotificationOpen((open) => !open)}
            className={`icon-btn notification-btn ${notificationOpen ? 'icon-btn-active' : ''}`}
          >
            <Bell size={17} />
            <span className="notification-dot" />
          </button>

          {notificationOpen && (
            <div className="notification-popover animate-fade">
              <div className="notification-popover-head">
                <b>Notificações</b>
                <span className="notif-badge">3 pendentes</span>
              </div>
              <div className="notification-list">
                <div className="notif-item">
                  <span className="notif-dot notif-amber" />
                  <div>
                    <p>Relatório de efluentes vence em breve</p>
                    <small>CD Cajamar · Há 10 min</small>
                  </div>
                </div>
                <div className="notif-item">
                  <span className="notif-dot notif-green" />
                  <div>
                    <p>PGRS aprovado e protocolado</p>
                    <small>CD Extrema · Há 1 hora</small>
                  </div>
                </div>
                <div className="notif-item">
                  <span className="notif-dot notif-amber" />
                  <div>
                    <p>Renovação de licença necessária</p>
                    <small>CD Joinville · Há 3 horas</small>
                  </div>
                </div>
              </div>
              <div className="notification-foot">
                <Link href="/tarefas" onClick={() => setNotificationOpen(false)}>
                  Ver todas as tarefas →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
