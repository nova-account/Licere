import React from 'react';
import { ChevronDown, Filter, ListFilter, Plus, Search, X } from 'lucide-react';
import { Mark } from '@/shared/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function useQuerySearch() {
  return '';
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
          <SelectTrigger className="select-wrap custom-shadcn-trigger" aria-label="filtrar itens" data-testid="select-filter">
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Filter size={15} />
              <SelectValue />
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
          className="filter-btn"
          onClick={onClear}
          data-testid="button-limpar-filtros"
        >
          <ListFilter size={15} />
          Limpar filtros
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
}: {
  title: string;
  description: string;
  onClear: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-mark">
        <Mark />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="quiet-btn" onClick={onClear}>
        Limpar filtros
      </button>
    </div>
  );
}
