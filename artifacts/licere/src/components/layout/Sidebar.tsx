import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FolderOpen,
  LayoutDashboard,
  ListTodo,
  LogIn,
  MoreHorizontal,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Mark, cn } from '@/shared/ui';
import { centros, initialCondicionantes } from '@/shared/data';

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
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
      count: initialCondicionantes.length,
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

      <div className="workspace-switcher">
        <span className="workspace-avatar">OB</span>
        <span>
          <b>Operações Brasil</b>
          <small>Acesso Administrador</small>
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
              (location === href || location.startsWith(`${href}?`)) && 'nav-item-active',
            )}
          >
            <NavIcon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {count ? <em>{count}</em> : null}
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
              location.startsWith(href) && 'nav-item-active',
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
        <Link href="/login" onClick={onClose} className="help-link access-link">
          <LogIn size={17} />
          Acesso de demonstração
        </Link>
        <Link
          href="/perfil"
          onClick={onClose}
          className="profile"
          data-testid="link-profile"
        >
          <span className="profile-avatar">MA</span>
          <span>
            <b>Marina Azevedo</b>
            <small>Administradora</small>
          </span>
          <MoreHorizontal size={16} />
        </Link>
      </div>
    </aside>
  );
}
