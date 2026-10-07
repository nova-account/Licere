import { z } from 'zod';
import {
  statusSchema,
  centroStatusSchema,
  centroSchema,
  licencaSchema,
  condicionanteSchema,
  documentoSchema
} from './schemas';

export type Status = z.infer<typeof statusSchema>;
export type CentroStatus = z.infer<typeof centroStatusSchema>;
export type Centro = z.infer<typeof centroSchema>;
export type Licenca = z.infer<typeof licencaSchema>;
export type Condicionante = z.infer<typeof condicionanteSchema>;
export type Documento = z.infer<typeof documentoSchema>;

export type DetailItem = Licenca | Condicionante | Documento | Centro;

export const isLicenca = (item: DetailItem): item is Licenca => 'numero' in item;
export const isCondicionante = (item: DetailItem): item is Condicionante => 'recorrencia' in item;
export const isDocumento = (item: DetailItem): item is Documento => 'categoria' in item && 'nome' in item;
export const isCentro = (item: DetailItem): item is Centro => !('numero' in item) && !('recorrencia' in item) && !('categoria' in item);
