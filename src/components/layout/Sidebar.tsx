import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  CircleHelp,
  ClipboardCheck,
  FolderOpen,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MoreHorizontal,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Mark, initials } from '@/shared/ui';
import { cn } from '@/lib/utils';
import { useAppData } from '@/lib/AppDataContext';

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { centros, condicionantes, workspace, user } = useAppData();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('licere_auth_user');
    }
    onClose();
    router.replace('/login');
  };

  const workspaceName = workspace?.nome || user?.empresa || 'Organização';
  const workspaceAvatar = (initials(workspaceName) || workspaceName.slice(0, 2)).toUpperCase();

  const nav = [
    { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
    {
      href: '/unidades',
      label: 'Unidades',
      icon: Building2,
      count: centros.length,
    },
    { href: '/documentos', label: 'Documentos', icon: FolderOpen },
    {
      href: '/tarefas',
      label: 'Tarefas',
      icon: ListTodo,
      count: condicionantes.filter((c) => c.status !== 'Concluída').length,
    },
  ];

  const secondaryNav = [
    { href: '/licencas', label: 'Licenças', icon: ShieldCheck },
    { href: '/condicionantes', label: 'Condicionantes', icon: ClipboardCheck },
  ];

  return (
    <aside className={cn('sidebar', open && 'sidebar-open')}>
      <div className="sidebar-top">
        <Link href="/dashboard" className="brand" onClick={onClose}>
          <Mark />
          <span>licere</span>
        </Link>
        <button
          aria-label="fechar menu"
          onClick={onClose}
          className="icon-btn sidebar-close-btn"
        >
          <X size={17} />
        </button>
      </div>

      <div className="workspace-switcher" title={workspaceName}>
        <span className="workspace-avatar">{workspaceAvatar}</span>
        <span>
          <b>{workspaceName}</b>
          <small>{workspace?.tipo || 'Acesso Corporativo'}</small>
        </span>
      </div>

      <nav className="nav-list" aria-label="Navegação principal">
        {nav.map(({ href, label, icon: NavIcon, count }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            data-testid={`link-${label.toLowerCase().replace(/\s+/g, '-')}`}
            className={cn(
              'nav-item',
              (pathname === href || pathname.startsWith(`${href}?`)) && 'nav-item-active',
            )}
          >
            <NavIcon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {count !== undefined && count > 0 ? <em>{count}</em> : null}
          </Link>
        ))}
      </nav>

      <div className="nav-secondary">
        <span>Controle</span>
        {secondaryNav.map(({ href, label, icon: NavIcon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            data-testid={`link-${label.toLowerCase().replace(/\s+/g, '-')}`}
            className={cn(
              'nav-item',
              pathname.startsWith(href) && 'nav-item-active',
            )}
          >
            <NavIcon size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-bottom">
        <Link href="/ajuda" onClick={onClose} className="help-link">
          <CircleHelp size={17} />
          Central de ajuda
        </Link>
        <div className="profile-footer">
          <Link
            href="/perfil"
            onClick={onClose}
            className="profile"
            data-testid="link-profile"
          >
            <span className="profile-avatar">
              {user?.nome ? initials(user.nome) : 'U'}
            </span>
            <span>
              <b>{user?.nome || 'Usuário'}</b>
              <small>{user?.cargo || 'Acesso ativo'}</small>
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="logout-icon-btn"
            title="Encerrar sessão"
            aria-label="Encerrar sessão"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
