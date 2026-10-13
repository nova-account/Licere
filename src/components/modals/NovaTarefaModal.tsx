import React, { useEffect } from 'react';
import { ListTodo } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Condicionante } from '@/shared/types';
import { useAppData } from '@/lib/AppDataContext';
import { condicionanteFormSchema } from '@/shared/schemas';
import {
  FormModal,
  FormField,
  FormInput,
  FormSelect,
} from './FormModal';

type NovaTarefaFormData = z.infer<typeof condicionanteFormSchema>;

interface NovaTarefaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (tarefa: Condicionante) => void;
}

const RECORRENCIA_OPTIONS = [
  { value: 'Única', label: 'Única' },
  { value: 'Semanal', label: 'Semanal' },
  { value: 'Mensal', label: 'Mensal' },
  { value: 'Trimestral', label: 'Trimestral' },
  { value: 'Semestral', label: 'Semestral' },
  { value: 'Anual', label: 'Anual' },
];

const STATUS_OPTIONS = [
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Em andamento', label: 'Em andamento' },
  { value: 'Concluída', label: 'Concluída' },
];

export function NovaTarefaModal({ open, onClose, onSave }: NovaTarefaModalProps) {
  const { centros, licencas } = useAppData();
  const activeCentros = centros.filter((c) => c.status === 'Ativa');
  const defaultCentro = activeCentros[0] || centros[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NovaTarefaFormData>({
    resolver: zodResolver(condicionanteFormSchema),
    defaultValues: {
      titulo: '',
      centroId: defaultCentro?.id || '',
      licencaId: licencas.filter((l) => l.centroId === (defaultCentro?.id || ''))[0]?.id || licencas[0]?.id || '',
      responsavel: defaultCentro?.responsavel || '',
      prazo: '',
      recorrencia: 'Semanal',
      status: 'Pendente',
    },
  });

  const centroId = watch('centroId');
  const licencaId = watch('licencaId');
  const recorrencia = watch('recorrencia');
  const status = watch('status');

  const availableLicenses = licencas.filter((l) => l.centroId === centroId);

  useEffect(() => {
    if (defaultCentro) {
      setValue('centroId', defaultCentro.id);
      if (defaultCentro.responsavel) {
        setValue('responsavel', defaultCentro.responsavel);
      }
    }
  }, [defaultCentro, setValue]);

  useEffect(() => {
    if (availableLicenses.length > 0 && !availableLicenses.some((l) => l.id === licencaId)) {
      setValue('licencaId', availableLicenses[0].id);
    }
    const selected = centros.find((c) => c.id === centroId);
    if (selected?.responsavel) {
      setValue('responsavel', selected.responsavel);
    }
  }, [centroId, centros, availableLicenses, licencaId, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: NovaTarefaFormData) => {
    const nova: Condicionante = {
      id: `tar-${Date.now()}`,
      ...data,
    };
    onSave(nova);
    onClose();
  };

  const licenseOptions =
    availableLicenses.length > 0
      ? availableLicenses.map((l) => ({
          value: l.id,
          label: `${l.tipo} · ${l.numero}`,
        }))
      : [{ value: 'none', label: 'Nenhuma licença vinculada' }];

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Nova Tarefa"
      eyebrow="Gestão de Tarefas"
      icon={<ListTodo size={18} />}
      submitLabel="Criar tarefa"
      maxWidth="540px"
    >
      <FormField
        label="O que precisa ser feito?"
        required
        error={errors.titulo?.message}
      >
        <FormInput
          type="text"
          placeholder="Ex: Atualizar laudo de ruído perimetral"
          error={!!errors.titulo}
          {...register('titulo')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3.5">
        <FormField
          label="Unidade"
          required
          error={errors.centroId?.message}
        >
          <FormSelect
            value={centroId}
            onValueChange={(val) => setValue('centroId', val, { shouldValidate: true })}
            options={activeCentros.map((c) => ({ value: c.id, label: c.nome }))}
            error={!!errors.centroId}
          />
        </FormField>

        <FormField
          label="Licença de Origem"
          error={errors.licencaId?.message}
        >
          <FormSelect
            value={licencaId}
            onValueChange={(val) => setValue('licencaId', val, { shouldValidate: true })}
            options={licenseOptions}
            error={!!errors.licencaId}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <FormField
          label="Responsável Operacional"
          required
          error={errors.responsavel?.message}
        >
          <FormInput
            type="text"
            placeholder="Nome do responsável"
            error={!!errors.responsavel}
            {...register('responsavel')}
          />
        </FormField>

        <FormField
          label="Data Limite"
          required
          error={errors.prazo?.message}
        >
          <FormInput
            type="date"
            error={!!errors.prazo}
            {...register('prazo')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <FormField
          label="Recorrência"
          error={errors.recorrencia?.message}
        >
          <FormSelect
            value={recorrencia}
            onValueChange={(val) => setValue('recorrencia', val, { shouldValidate: true })}
            options={RECORRENCIA_OPTIONS}
            error={!!errors.recorrencia}
          />
        </FormField>

        <FormField
          label="Status Inicial"
          error={errors.status?.message}
        >
          <FormSelect
            value={status}
            onValueChange={(val) => setValue('status', val as NovaTarefaFormData['status'], { shouldValidate: true })}
            options={STATUS_OPTIONS}
            error={!!errors.status}
          />
        </FormField>
      </div>
    </FormModal>
  );
}
