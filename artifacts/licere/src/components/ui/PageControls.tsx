import React from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, Filter, ListFilter, Plus, Search, X } from 'lucide-react';
import { Mark } from '@/shared/ui';

export function useQuerySearch() {
  const [location] = useLocation();
  return new URLSearchParams(location.split('?')[1] ?? '').get('busca') ?? '';
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
        <label className="select-wrap">
          <Filter size={15} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="filtrar itens"
            data-testid="select-filter"
          >
            <option value="Todos">Todos</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </label>

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
