import { z } from 'zod';
import {
  statusSchema,
  centroStatusSchema,
  centroSchema,
  centroFormSchema,
  licencaSchema,
  licencaFormSchema,
  condicionanteSchema,
  condicionanteFormSchema,
  documentoSchema,
  documentoFormSchema,
  usuarioSchema,
  perfilFormSchema,
  loginSchema,
  tipoAcessoSchema,
} from './schemas';

export type Status = z.infer<typeof statusSchema>;
export type CentroStatus = z.infer<typeof centroStatusSchema>;
export type TipoAcesso = z.infer<typeof tipoAcessoSchema>;

export type Centro = z.infer<typeof centroSchema>;
export type CentroFormData = z.infer<typeof centroFormSchema>;

export type Licenca = z.infer<typeof licencaSchema>;
export type LicencaFormData = z.infer<typeof licencaFormSchema>;

export type Condicionante = z.infer<typeof condicionanteSchema>;
export type CondicionanteFormData = z.infer<typeof condicionanteFormSchema>;

export type Documento = z.infer<typeof documentoSchema>;
export type DocumentoFormData = z.infer<typeof documentoFormSchema>;

export type Usuario = z.infer<typeof usuarioSchema>;
export type PerfilFormData = z.infer<typeof perfilFormSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;

export type DetailItem = Licenca | Condicionante | Documento | Centro;

export const isLicenca = (item: DetailItem): item is Licenca => 'numero' in item;
export const isCondicionante = (item: DetailItem): item is Condicionante => 'recorrencia' in item;
export const isDocumento = (item: DetailItem): item is Documento => 'categoria' in item && 'nome' in item;
export const isCentro = (item: DetailItem): item is Centro => !('numero' in item) && !('recorrencia' in item) && !('categoria' in item);
