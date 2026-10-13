import React, { useEffect } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Condicionante, Licenca } from '@/shared/types';
import { condicionanteFormSchema } from '@/shared/schemas';
import { useAppData } from '@/lib/AppDataContext';
import {
  FormModal,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
} from './FormModal';

type NovaCondicionanteFormData = z.infer<typeof condicionanteFormSchema>;

interface NovaCondicionanteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (condicionante: Condicionante) => void;
  licencas?: Licenca[];
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

export function NovaCondicionanteModal({
  open,
  onClose,
  onSave,
  licencas: propLicencas,
}: NovaCondicionanteModalProps) {
  const { centros, licencas: storeLicencas } = useAppData();
  const licencas = propLicencas || storeLicencas;
  const activeCentros = centros.filter((c) => c.status === 'Ativa');
  const defaultCentro = activeCentros[0] || centros[0];
  const defaultCentroId = defaultCentro?.id || '';
  const initialLicenses = licencas.filter((l) => l.centroId === defaultCentroId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NovaCondicionanteFormData>({
    resolver: zodResolver(condicionanteFormSchema),
    defaultValues: {
      titulo: '',
      centroId: defaultCentroId,
      licencaId: initialLicenses[0]?.id || licencas[0]?.id || '',
      responsavel: defaultCentro?.responsavel || '',
      prazo: '',
      recorrencia: 'Anual',
      status: 'Pendente',
    },
  });

  const centroId = watch('centroId');
  const licencaId = watch('licencaId');
  const recorrencia = watch('recorrencia');
  const status = watch('status');

  const availableLicenses = licencas.filter((l) => l.centroId === centroId);

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

  const onSubmit = (data: NovaCondicionanteFormData) => {
    const nova: Condicionante = {
      id: `con-${Date.now()}`,
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
      title="Nova Condicionante"
      eyebrow="Obrigação Ambiental"
      icon={<ClipboardCheck size={18} />}
      submitLabel="Salvar condicionante"
      maxWidth="540px"
    >
      <FormField
        label="Obrigação / Descrição da Condicionante"
        required
        error={errors.titulo?.message}
      >
        <FormTextarea
          rows={2}
          placeholder="Ex: Enviar relatório semestral de monitoramento de efluentes"
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
            options={centros.map((c) => ({ value: c.id, label: c.nome }))}
            error={!!errors.centroId}
          />
        </FormField>

        <FormField
          label="Licença Vinculada"
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
          label="Responsável"
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
          label="Prazo de Atendimento"
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
          label="Status"
          error={errors.status?.message}
        >
          <FormSelect
            value={status}
            onValueChange={(val) => setValue('status', val as NovaCondicionanteFormData['status'], { shouldValidate: true })}
            options={STATUS_OPTIONS}
            error={!!errors.status}
          />
        </FormField>
      </div>
    </FormModal>
  );
}
