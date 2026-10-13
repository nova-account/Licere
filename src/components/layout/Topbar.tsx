import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Menu, Search, Plus } from 'lucide-react';
import { useAppData } from '@/lib/AppDataContext';
import { getDocumentStatus } from '@/shared/utils';

export function Topbar({
  onMenu,
  onQuickAdd,
}: {
  onMenu: () => void;
  onQuickAdd?: () => void;
}) {
  const router = useRouter();
  const { workspace, centros, licencas, condicionantes, documentos, setDetail } = useAppData();
  const [search, setSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notifRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    }
    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  const notifications = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      tone: 'notif-amber' | 'notif-green';
      isPending: boolean;
      item: any;
    }> = [];

    // 1. Condicionantes / Tarefas
    condicionantes.forEach((cond) => {
      const center = centros.find((c) => c.id === cond.centroId);
      const isConcluida = cond.status === 'Concluída';
      list.push({
        id: `cond-${cond.id}`,
        title: isConcluida ? `${cond.titulo} concluída` : `${cond.titulo} requer atenção`,
        subtitle: `${center?.nome || 'Operação'} · Prazo: ${cond.prazo}`,
        tone: isConcluida ? 'notif-green' : 'notif-amber',
        isPending: !isConcluida,
        item: cond,
      });
    });

    // 2. Documentos do acervo
    documentos.forEach((doc) => {
      const center = centros.find((c) => c.id === doc.centroId);
      const docStatus = getDocumentStatus(doc.validade);
      if (docStatus !== 'Válido') {
        list.push({
          id: `doc-${doc.id}`,
          title: docStatus === 'Expirado' ? `${doc.nome} expirado` : `${doc.nome} vence em breve`,
          subtitle: `${center?.nome || 'Unidade'} · Validade: ${doc.validade || 'N/A'}`,
          tone: 'notif-amber',
          isPending: true,
          item: doc,
        });
      }
    });

    // 3. Licenças ambientais
    licencas.forEach((lic) => {
      const center = centros.find((c) => c.id === lic.centroId);
      const isPending = lic.status !== 'Vigente';
      if (isPending) {
        list.push({
          id: `lic-${lic.id}`,
          title: `Renovação de licença necessária: ${lic.tipo}`,
          subtitle: `${center?.nome || 'Unidade'} · ${lic.orgao}`,
          tone: 'notif-amber',
          isPending: true,
          item: lic,
        });
      }
    });

    // Priorizar pendências no topo
    list.sort((a, b) => (b.isPending ? 1 : 0) - (a.isPending ? 1 : 0));
    return list;
  }, [condicionantes, documentos, licencas, centros]);

  const pendingCount = notifications.filter((n) => n.isPending).length;

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
    router.push(`${path}?busca=${encodeURIComponent(value)}`);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu icon-btn" onClick={onMenu} aria-label="abrir menu">
          <Menu size={18} />
        </button>
        <div className="topbar-context">
          <span>Workspace</span>
          <strong>{workspace?.nome || 'Organização'}</strong>
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

        <div className="notification-wrap flex gap-2" ref={notifRef}>
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
            {pendingCount > 0 && <span className="notification-dot" />}
          </button>

          {notificationOpen && (
            <div className="notification-popover animate-fade">
              <div className="notification-popover-head">
                <b>Notificações</b>
                <span className="notif-badge">
                  {pendingCount} {pendingCount === 1 ? 'pendente' : 'pendentes'}
                </span>
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="py-6 px-4 text-center">
                    <p className="text-[12px] text-[#829497] m-0">Nenhuma notificação no momento</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setNotificationOpen(false);
                        if (setDetail && notif.item) {
                          setDetail(notif.item);
                        }
                      }}
                      className="notif-item cursor-pointer"
                      title="Clique para abrir detalhes"
                    >
                      <span className={`notif-dot ${notif.tone}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate">{notif.title}</p>
                        <small className="truncate">{notif.subtitle}</small>
                      </div>
                    </div>
                  ))
                )}
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
