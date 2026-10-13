import React, { useEffect, useState } from 'react';
import { FolderOpen, UploadCloud, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Documento } from '@/shared/types';
import { useAppData } from '@/lib/AppDataContext';
import { documentoFormSchema } from '@/shared/schemas';
import {
  FormModal,
  FormField,
  FormInput,
  FormSelect,
} from './FormModal';

type NovoDocumentoFormData = z.infer<typeof documentoFormSchema>;

interface NovoDocumentoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (documento: Documento) => void;
}

const CATEGORIA_OPTIONS = [
  { value: 'Relatórios', label: 'Relatórios' },
  { value: 'Laudos Técnicos', label: 'Laudos Técnicos' },
  { value: 'Licenças & Alvarás', label: 'Licenças & Alvarás' },
  { value: 'Outorgas', label: 'Outorgas' },
  { value: 'Certidões', label: 'Certidões' },
];

export function NovoDocumentoModal({ open, onClose, onSave }: NovoDocumentoModalProps) {
  const { centros, licencas } = useAppData();
  const activeCentros = centros.filter((c) => c.status === 'Ativa');
  const defaultCentroId = activeCentros[0]?.id || centros[0]?.id || '';
  const [inactiveError, setInactiveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NovoDocumentoFormData>({
    resolver: zodResolver(documentoFormSchema),
    defaultValues: {
      nome: '',
      categoria: 'Relatórios',
      centroId: defaultCentroId,
      validade: '2026-12-31',
      atualizadoEm: '',
      tamanho: '',
    },
  });

  const categoria = watch('categoria');
  const centroId = watch('centroId');

  useEffect(() => {
    if (defaultCentroId) {
      setValue('centroId', defaultCentroId);
    }
  }, [defaultCentroId, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
      setInactiveError(null);
    }
  }, [open, reset]);

  const onSubmit = (data: NovoDocumentoFormData) => {
    setInactiveError(null);

    const selectedCentro = centros.find((c) => c.id === data.centroId);
    if (selectedCentro?.status === 'Inativa') {
      setInactiveError('Unidades inativas não podem receber novos documentos ou evidências.');
      return;
    }

    const cleanName = data.nome.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, '');
    const novo: Documento = {
      id: `doc-${Date.now()}`,
      nome: cleanName.toLowerCase().endsWith('.pdf') ? cleanName : `${cleanName}.pdf`,
      categoria: data.categoria,
      centroId: data.centroId,
      licencaId: licencas.find((l) => l.centroId === data.centroId)?.id,
      tamanho: '2.1 MB',
      atualizadoEm: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      validade: data.validade || 'Permanente',
    };

    onSave(novo);
    reset();
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Novo Documento / Evidência"
      eyebrow="Repositório Documental"
      icon={<FolderOpen size={18} />}
      submitLabel="Salvar documento"
      maxWidth="520px"
    >
      {inactiveError && (
        <div className="py-2.5 px-3 bg-[#fdeded] border border-[#f5c2c7] rounded-[6px] text-[#b02a37] text-[12px] flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{inactiveError}</span>
        </div>
      )}

      <FormField
        label="Nome do Arquivo ou Documento"
        required
        error={errors.nome?.message}
      >
        <FormInput
          type="text"
          placeholder="Ex: Laudo_Analise_Agua_2025.pdf"
          error={!!errors.nome}
          {...register('nome')}
        />
      </FormField>

      <div className="grid grid-cols-[1.1fr_1fr] gap-3.5">
        <FormField
          label="Categoria"
          error={errors.categoria?.message}
        >
          <FormSelect
            value={categoria}
            onValueChange={(val) => setValue('categoria', val, { shouldValidate: true })}
            options={CATEGORIA_OPTIONS}
            error={!!errors.categoria}
          />
        </FormField>

        <FormField
          label="Unidade Vinculada"
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
      </div>

      <FormField
        label="Validade do Documento"
        error={errors.validade?.message}
      >
        <FormInput
          type="date"
          error={!!errors.validade}
          {...register('validade')}
        />
      </FormField>

      <div
        className="border-[1.5px] border-dashed border-[#cfdbd5] rounded-[10px] py-6 px-4 flex flex-col items-center justify-center gap-2 bg-[#fcfdfd] cursor-pointer transition-all duration-150 hover:border-[#70a48a] hover:bg-[#f4f7f6]"
      >
        <div className="size-[38px] rounded-full bg-[#e9f1ee] flex items-center justify-center text-[#1b6848]">
          <UploadCloud size={20} />
        </div>
        <div className="text-center">
          <p className="m-0 text-[12px] font-semibold text-[#2c4e3f]">Clique para simular upload ou arraste o PDF</p>
          <span className="text-[10px] text-[#829397]">PDF, DOCX ou XLSX até 25MB (simulação)</span>
        </div>
      </div>
    </FormModal>
  );
}
