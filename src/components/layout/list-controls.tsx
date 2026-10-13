import React from 'react';
import { Filter, ListFilter, Plus, Search, X } from 'lucide-react';
import { Mark } from '@/shared/ui';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function useQuerySearch(onQueryFound?: (query: string) => void) {
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('busca') || '';
      if (param) {
        setQuery(param);
        onQueryFound?.(param);
      }
    }
  }, [onQueryFound]);

  return query;
}

export function FilterBar({
  search,
  setSearch,
  filter,
  setFilter,
  options,
  placeholder,
  onClear,
}: {
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
  options: string[];
  placeholder: string;
  onClear: () => void;
}) {
  const hasActiveFilters = Boolean(search.trim() || (filter && filter !== 'Todos'));

  const getClearLabel = () => {
    if (search.trim() && filter && filter !== 'Todos') return 'Limpar tudo';
    if (search.trim()) return 'Limpar busca';
    return 'Limpar filtros';
  };

  return (
    <div className="filter-bar">
      <label className="list-search">
        <Search size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          data-testid="input-list-search"
        />
        {search && (
          <button onClick={() => setSearch('')} aria-label="limpar busca">
            <X size={14} />
          </button>
        )}
      </label>

      <div className="filter-actions">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger
            className="select-wrap custom-shadcn-trigger active:scale-100"
            aria-label="filtrar itens"
            data-testid="select-filter"
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Filter size={15} className="shrink-0 text-[#7b887d]" />
              <span className="truncate block min-w-0 flex-1 text-left text-[11px] text-[#67736a]">
                <SelectValue />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            <SelectItem value="Todos">Todos</SelectItem>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          className={cn(
            'filter-btn transition-opacity',
            !hasActiveFilters && 'opacity-60 cursor-not-allowed hover:bg-transparent hover:text-inherit',
          )}
          onClick={onClear}
          disabled={!hasActiveFilters}
          data-testid="button-limpar-filtros"
        >
          <ListFilter size={15} />
          {getClearLabel()}
        </button>
      </div>
    </div>
  );
}

export function ListHeader({
  count,
  label,
  onAdd,
  addLabel = 'Adicionar',
}: {
  count: number;
  label: string;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="list-header">
      <span>
        <b>{count}</b> {label}
      </span>
      {onAdd && (
        <button
          className="quick-add"
          onClick={onAdd}
          data-testid="button-adicionar-item"
        >
          <Plus size={16} />
          {addLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  onClear,
  clearLabel,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  onClear?: () => void;
  clearLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="empty-state flex flex-col items-center py-[62px] px-5 pb-[70px] text-center w-full">
      <div className="empty-mark grid place-items-center w-12 h-12 rounded-[13px] text-[#2d7354] bg-[#e2f0e8]">
        <Mark className="w-[26px] h-[26px]" />
      </div>
      <h3 className="mt-[15px] mb-[5px] text-[#315b4a] font-['Manrope',sans-serif] font-bold text-[15px]">
        {title}
      </h3>
      <p className="max-w-[380px] m-0 mb-5 text-[#829397] text-[12px] leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-2.5 flex-wrap justify-center">
        {onClear && (
          <button
            className="quiet-btn inline-flex items-center justify-center gap-[7px] min-h-[32px] px-3.5 rounded-[9px] border border-[#d8e5dc] text-[#648273] bg-[#f8fbf8] text-[12px] font-semibold transition-all hover:text-[#175f42] hover:bg-[#e8f0ed] cursor-pointer"
            onClick={onClear}
            type="button"
          >
            {clearLabel || 'Limpar filtros'}
          </button>
        )}
        {onAction && actionLabel && (
          <button
            className="inline-flex items-center justify-center gap-[6px] min-h-[32px] px-3.5 rounded-[9px] bg-[#1a5336] text-white text-[12px] font-semibold shadow-xs transition-all hover:bg-[#14422b] cursor-pointer"
            onClick={onAction}
            type="button"
          >
            <Plus size={14} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function ListSkeleton({
  rows = 5,
  variant = 'row',
}: {
  rows?: number;
  variant?: 'row' | 'table' | 'unit' | 'document' | 'condition';
}) {
  if (variant === 'table') {
    return (
      <div className="table-scroll w-full" aria-busy="true" aria-label="Carregando licenças...">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>Licença</th>
              <th>Unidade</th>
              <th>Órgão</th>
              <th>Vencimento</th>
              <th>Criticidade</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody className="animate-pulse">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="pointer-events-none">
                <td>
                  <div className="flex flex-col gap-1.5 py-1">
                    <div className="h-3 w-28 rounded bg-[#dce7df]/80" />
                    <div className="h-2.5 w-20 rounded bg-[#dce7df]/50" />
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-[#dce7df]/60 shrink-0" />
                    <div className="h-2.5 w-24 rounded bg-[#dce7df]/60" />
                  </div>
                </td>
                <td>
                  <div className="h-2.5 w-16 rounded bg-[#dce7df]/60" />
                </td>
                <td>
                  <div className="h-2.5 w-20 rounded bg-[#dce7df]/60" />
                </td>
                <td>
                  <div className="h-5 w-16 rounded-full bg-[#dce7df]/60" />
                </td>
                <td>
                  <div className="h-5 w-20 rounded-full bg-[#dce7df]/60" />
                </td>
                <td>
                  <div className="size-3.5 rounded bg-[#dce7df]/40 shrink-0" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (variant === 'unit') {
    return (
      <div className="w-full flex flex-col animate-pulse" aria-busy="true" aria-label="Carregando unidades...">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid [grid-template-columns:38px_minmax(180px,1fr)_minmax(150px,0.65fr)_auto_16px] max-[760px]:[grid-template-columns:36px_1fr_auto_16px] items-center w-full gap-3.5 max-[760px]:gap-2 px-5 py-3.5 border-t border-[#e4ebed] first:border-t-0 pointer-events-none"
          >
            <div className="size-[38px] max-[760px]:size-[36px] rounded-[10px] bg-[#dce7df]/70 shrink-0" />
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="h-3 w-40 rounded bg-[#dce7df]/80" />
              <div className="h-2.5 w-28 rounded bg-[#dce7df]/50" />
            </div>
            <div className="flex items-center gap-1.5 max-[760px]:hidden">
              <div className="size-5 rounded-full bg-[#dce7df]/60 shrink-0" />
              <div className="h-2.5 w-24 rounded bg-[#dce7df]/60" />
            </div>
            <div className="h-5 w-16 rounded-full bg-[#dce7df]/60 shrink-0" />
            <div className="size-3.5 rounded bg-[#dce7df]/40 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'document') {
    return (
      <div className="w-full flex flex-col animate-pulse" aria-busy="true" aria-label="Carregando documentos...">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="document-card !px-5 max-[760px]:!px-3.5 pointer-events-none"
          >
            <div className="document-icon">
              <div className="size-5 rounded bg-[#dce7df]/70" />
            </div>
            <div className="document-content flex-1">
              <div className="h-3 w-48 rounded bg-[#dce7df]/80 mb-1.5" />
              <div className="h-2.5 w-36 rounded bg-[#dce7df]/50 mb-2" />
              <div className="flex items-center gap-3">
                <div className="h-2 w-24 rounded bg-[#dce7df]/40" />
                <div className="h-2 w-12 rounded bg-[#dce7df]/40" />
              </div>
            </div>
            <div className="document-status shrink-0 flex items-center gap-1.5">
              <div className="h-5 w-16 rounded-full bg-[#dce7df]/60" />
              <div className="size-3.5 rounded bg-[#dce7df]/40 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'condition') {
    return (
      <div className="condition-list animate-pulse" aria-busy="true" aria-label="Carregando rotinas...">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="condition-row pointer-events-none">
            <div className="check-box shrink-0">
              <div className="size-3.5 rounded bg-[#dce7df]/40" />
            </div>
            <div className="condition-main">
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="h-3 w-52 rounded bg-[#dce7df]/80" />
                <div className="h-2.5 w-32 rounded bg-[#dce7df]/50" />
              </div>
              <div className="condition-responsible">
                <div className="size-5 rounded-full bg-[#dce7df]/60 shrink-0" />
                <div className="h-2.5 w-20 rounded bg-[#dce7df]/60" />
              </div>
              <div className="condition-deadline">
                <div className="h-5 w-24 rounded-full bg-[#dce7df]/50" />
              </div>
              <div className="h-5 w-16 rounded-full bg-[#dce7df]/60" />
              <div className="size-3.5 rounded bg-[#dce7df]/40 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="w-full flex flex-col divide-y divide-[#e4ebed]"
      aria-busy="true"
      aria-label="Carregando..."
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between w-full px-5 py-3.5 animate-pulse gap-3.5"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-[#dce7df]/60 shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1 max-w-[260px]">
              <div className="h-3 w-4/5 rounded bg-[#dce7df]/80" />
              <div className="h-2.5 w-1/2 rounded bg-[#dce7df]/50" />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-5 w-16 rounded-full bg-[#dce7df]/60" />
          </div>
          <div className="w-3.5 h-3.5 rounded bg-[#dce7df]/40 shrink-0" />
        </div>
      ))}
    </div>
  );
}