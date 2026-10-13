import React, { useState, useMemo } from 'react';
import {
  Building2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { DrawerShell } from './DrawerShell';
import { useAppData } from '@/lib/AppDataContext';
import { Avatar } from '@/shared/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ActivityItem {
  id: string;
  type: 'documento' | 'tarefa' | 'licenca' | 'unidade';
  typeLabel: string;
  person: string;
  action: string;
  target: string;
  centerName: string;
  extra: string;
  avatarTone: string;
  item: any;
}

export function ActivityHistoryDrawer({
  open,
  onClose,
  onOpenItem,
}: {
  open: boolean;
  onClose: () => void;
  onOpenItem: (item: any) => void;
}) {
  const { centros, documentos, condicionantes, licencas } = useAppData();
  const [filter, setFilter] = useState<string>('Todos');

  const activities = useMemo(() => {
    const list: ActivityItem[] = [];
    const tones = ['avatar-olive', 'avatar-sand', 'avatar-blue'];

    // 1. Documentos
    documentos.forEach((doc, idx) => {
      const center = centros.find((c) => c.id === doc.centroId);
      list.push({
        id: `doc-${doc.id}`,
        type: 'documento',
        typeLabel: 'Documento',
        person: center?.responsavel || 'Equipe Técnica',
        action: 'atualizou o documento',
        target: doc.nome,
        centerName: center?.nome || 'Unidade Geral',
        extra: `Validade: ${doc.validade || 'N/A'}`,
        avatarTone: tones[idx % tones.length],
        item: doc,
      });
    });

    // 2. Condicionantes / Tarefas
    condicionantes.forEach((cond, idx) => {
      const center = centros.find((c) => c.id === cond.centroId);
      list.push({
        id: `cond-${cond.id}`,
        type: 'tarefa',
        typeLabel: 'Tarefa',
        person: cond.responsavel || 'Responsável',
        action:
          cond.status === 'Concluída'
            ? 'concluiu a condicionante'
            : 'está acompanhando o prazo de',
        target: cond.titulo,
        centerName: center?.nome || 'Operação',
        extra: `Prazo: ${cond.prazo}`,
        avatarTone: tones[(idx + 1) % tones.length],
        item: cond,
      });
    });

    // 3. Licenças ambientais
    licencas.forEach((lic, idx) => {
      const center = centros.find((c) => c.id === lic.centroId);
      list.push({
        id: `lic-${lic.id}`,
        type: 'licenca',
        typeLabel: 'Licença',
        person: center?.responsavel || 'Órgão Ambiental',
        action:
          lic.status === 'Vigente'
            ? 'monitora a licença vigente'
            : 'requer renovação de',
        target: `${lic.tipo} (${lic.numero})`,
        centerName: center?.nome || 'Operação',
        extra: `${lic.orgao} · ${lic.status}`,
        avatarTone: tones[(idx + 2) % tones.length],
        item: lic,
      });
    });

    return list;
  }, [centros, documentos, condicionantes, licencas]);

  const filtered = useMemo(() => {
    if (filter === 'Todos') return activities;
    if (filter === 'Documentos') return activities.filter((a) => a.type === 'documento');
    if (filter === 'Tarefas') return activities.filter((a) => a.type === 'tarefa');
    if (filter === 'Licenças') return activities.filter((a) => a.type === 'licenca');
    return activities;
  }, [activities, filter]);

  if (!open) return null;

  return (
    <DrawerShell
      title="Histórico de atividades"
      subtitle={`${activities.length} eventos e registros operacionais`}
      eyebrow="Registro do sistema"
      onClose={onClose}
    >
      {/* Filtro consistente com as outras páginas, em escala compacta */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-[#dfe8e9]">
        <span className="text-[12.5px] font-semibold text-[#264839] tracking-tight">
          Filtrar
        </span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger
            className="select-wrap custom-shadcn-trigger custom-shadcn-trigger-sm active:scale-100"
            aria-label="filtrar atividades"
            data-testid="select-filter-atividades"
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Filter size={14} className="shrink-0 text-[#7b887d]" />
              <span className="truncate block min-w-0 flex-1 text-left text-[11px] text-[#67736a]">
                <SelectValue />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Documentos">Documentos</SelectItem>
            <SelectItem value="Tarefas">Tarefas</SelectItem>
            <SelectItem value="Licenças">Licenças</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de eventos detalhados */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <p className="text-[12px] text-[#829397] py-6 text-center">
            Nenhuma atividade encontrada nesta categoria.
          </p>
        ) : (
          filtered.map((act) => (
            <div
              key={act.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                onClose();
                onOpenItem(act.item);
              }}
              title="Clique para abrir detalhes"
              className="flex items-start gap-3 p-3 rounded-xl border border-[#d8e5e6] bg-[#fbfcfc] hover:bg-[#edf4f2] hover:border-[#b8cfc8] transition-all cursor-pointer group"
            >
              <Avatar name={act.person} size="md" shape="circle" className="shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <b className="text-[12px] text-[#243d32] truncate">{act.person}</b>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#ebf3ef] text-[#2c5b47] shrink-0 font-medium">
                    {act.typeLabel}
                  </span>
                </div>
                <p className="text-[11px] text-[#556960] leading-snug break-words">
                  {act.action}{' '}
                  <strong className="text-[#1c4b37] font-semibold">{act.target}</strong>
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#7a9287]">
                  <Building2 size={11} className="shrink-0" />
                  <span className="truncate">{act.centerName}</span>
                  <span>·</span>
                  <span className="truncate">{act.extra}</span>
                </div>
              </div>
              <ChevronRight
                size={14}
                className="text-[#a4b5ad] group-hover:text-[#176044] group-hover:translate-x-0.5 transition-all shrink-0 mt-2"
              />
            </div>
          ))
        )}
      </div>
    </DrawerShell>
  );
}
