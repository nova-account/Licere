import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Licenca } from '@/shared/types';
import { useAppData } from '@/lib/AppDataContext';
import { licencaFormSchema } from '@/shared/schemas';
import {
  FormModal,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
} from './FormModal';

type NovaLicencaFormData = z.infer<typeof licencaFormSchema>;

interface NovaLicencaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (licenca: Licenca) => void;
}

const TIPO_LICENCA_OPTIONS = [
  { value: 'Licença de Operação', label: 'Licença de Operação (LO)' },
  { value: 'Licença de Instalação', label: 'Licença de Instalação (LI)' },
  { value: 'Licença Prévia', label: 'Licença Prévia (LP)' },
  { value: 'Licença Ambiental de Operação', label: 'Licença Ambiental de Operação (LAO)' },
  { value: 'Outorga de captação', label: 'Outorga de captação' },
  { value: 'Dispensa de Licenciamento', label: 'Dispensa de Licenciamento' },
];

const CRITICIDADE_OPTIONS = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Média', label: 'Média' },
  { value: 'Baixa', label: 'Baixa' },
];

const STATUS_OPTIONS = [
  { value: 'Vigente', label: 'Vigente' },
  { value: 'Em análise', label: 'Em análise' },
  { value: 'A vencer', label: 'A vencer' },
  { value: 'Vencida', label: 'Vencida' },
];

export function NovaLicencaModal({ open, onClose, onSave }: NovaLicencaModalProps) {
  const { centros } = useAppData();
  const activeCentros = centros.filter((c) => c.status === 'Ativa');
  const defaultCentroId = activeCentros[0]?.id || centros[0]?.id || '';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NovaLicencaFormData>({
    resolver: zodResolver(licencaFormSchema),
    defaultValues: {
      tipo: 'Licença de Operação',
      numero: '',
      centroId: defaultCentroId,
      orgao: 'CETESB',
      emissao: new Date().toISOString().split('T')[0],
      vencimento: '',
      criticidade: 'Média',
      status: 'Vigente',
      observacao: '',
    },
  });

  const tipo = watch('tipo');
  const centroId = watch('centroId');
  const criticidade = watch('criticidade');
  const status = watch('status');

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: NovaLicencaFormData) => {
    const nova: Licenca = {
      id: `lic-${Date.now()}`,
      ...data,
    };
    onSave(nova);
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Nova Licença Ambiental"
      eyebrow="Cadastro de Licença"
      icon={<ShieldCheck size={18} />}
      submitLabel="Salvar licença"
      maxWidth="560px"
    >
      <div className="grid grid-cols-[1.2fr_1fr] gap-3.5">
        <FormField
          label="Tipo de Licença"
          required
          error={errors.tipo?.message}
        >
          <FormSelect
            value={tipo}
            onValueChange={(val) => setValue('tipo', val, { shouldValidate: true })}
            options={TIPO_LICENCA_OPTIONS}
            error={!!errors.tipo}
          />
        </FormField>

        <FormField
          label="Número / Identificação"
          required
          error={errors.numero?.message}
        >
          <FormInput
            type="text"
            placeholder="Ex: CETESB 48001234"
            error={!!errors.numero}
            {...register('numero')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-[1.2fr_1fr] gap-3.5">
        <FormField
          label="Unidade Vinculada"
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
          label="Órgão Ambiental Emissor"
          required
          error={errors.orgao?.message}
        >
          <FormInput
            type="text"
            placeholder="Ex: CETESB, IBAMA, INEA"
            error={!!errors.orgao}
            {...register('orgao')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <FormField
          label="Data de Emissão"
          required
          error={errors.emissao?.message}
        >
          <FormInput
            type="date"
            error={!!errors.emissao}
            {...register('emissao')}
          />
        </FormField>

        <FormField
          label="Data de Vencimento"
          required
          error={errors.vencimento?.message}
        >
          <FormInput
            type="date"
            error={!!errors.vencimento}
            {...register('vencimento')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <FormField
          label="Criticidade"
          error={errors.criticidade?.message}
        >
          <FormSelect
            value={criticidade}
            onValueChange={(val) => setValue('criticidade', val as NovaLicencaFormData['criticidade'], { shouldValidate: true })}
            options={CRITICIDADE_OPTIONS}
            error={!!errors.criticidade}
          />
        </FormField>

        <FormField
          label="Status da Licença"
          error={errors.status?.message}
        >
          <FormSelect
            value={status}
            onValueChange={(val) => setValue('status', val as NovaLicencaFormData['status'], { shouldValidate: true })}
            options={STATUS_OPTIONS}
            error={!!errors.status}
          />
        </FormField>
      </div>

      <FormField
        label="Observações / Condições Especiais"
        error={errors.observacao?.message}
      >
        <FormTextarea
          rows={2}
          placeholder="Ex: Condicionada à apresentação de relatório semestral de efluentes..."
          error={!!errors.observacao}
          {...register('observacao')}
        />
      </FormField>
    </FormModal>
  );
}
