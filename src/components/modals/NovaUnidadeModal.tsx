import React, { useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Centro } from '@/shared/types';
import { centroFormSchema } from '@/shared/schemas';
import {
  FormModal,
  FormField,
  FormInput,
  FormSelect,
} from './FormModal';

type NovaUnidadeFormData = z.infer<typeof centroFormSchema>;

interface NovaUnidadeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (unidade: Centro) => void;
}

const UF_OPTIONS = ['SP', 'MG', 'RJ', 'SC', 'PR', 'RS', 'GO', 'BA', 'ES', 'PE'].map((uf) => ({
  value: uf,
  label: uf,
}));

const STATUS_OPTIONS = [
  { value: 'Ativa', label: 'Ativa' },
  { value: 'Em expansão', label: 'Em expansão' },
  { value: 'Inativa', label: 'Inativa' },
];

export function NovaUnidadeModal({ open, onClose, onSave }: NovaUnidadeModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NovaUnidadeFormData>({
    resolver: zodResolver(centroFormSchema),
    defaultValues: {
      nome: '',
      cidade: '',
      estado: 'SP',
      responsavel: '',
      status: 'Ativa',
    },
  });

  const estado = watch('estado');
  const status = watch('status');

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: NovaUnidadeFormData) => {
    const nova: Centro = {
      id: `cd-${Date.now()}`,
      ...data,
    };

    onSave(nova);
    reset();
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Nova Unidade"
      eyebrow="Rede Operacional"
      icon={<Building2 size={18} />}
      submitLabel="Cadastrar unidade"
      maxWidth="520px"
    >
      <FormField
        label="Nome da Unidade"
        required
        error={errors.nome?.message}
      >
        <FormInput
          type="text"
          placeholder="Ex: CD Campinas, Filial Curitiba"
          error={!!errors.nome}
          {...register('nome')}
        />
      </FormField>

      <div className="grid grid-cols-[2fr_1fr] gap-3.5">
        <FormField
          label="Município"
          required
          error={errors.cidade?.message}
        >
          <FormInput
            type="text"
            placeholder="Ex: Campinas"
            error={!!errors.cidade}
            {...register('cidade')}
          />
        </FormField>

        <FormField
          label="UF"
          required
          error={errors.estado?.message}
        >
          <FormSelect
            value={estado}
            onValueChange={(val) => setValue('estado', val as NovaUnidadeFormData['estado'], { shouldValidate: true })}
            options={UF_OPTIONS}
            error={!!errors.estado}
          />
        </FormField>
      </div>

      <FormField
        label="Responsável Operacional"
        required
        error={errors.responsavel?.message}
      >
        <FormInput
          type="text"
          placeholder="Ex: Carlos Eduardo Mendes"
          error={!!errors.responsavel}
          {...register('responsavel')}
        />
      </FormField>

      <FormField
        label="Status Operacional"
        error={errors.status?.message}
      >
        <FormSelect
          value={status}
          onValueChange={(val) => setValue('status', val as NovaUnidadeFormData['status'], { shouldValidate: true })}
          options={STATUS_OPTIONS}
          error={!!errors.status}
        />
      </FormField>
    </FormModal>
  );
}
