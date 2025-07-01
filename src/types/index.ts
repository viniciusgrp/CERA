import { Document, ObjectId } from 'mongoose';

export interface IContato {
  codigoDDIWhatsapp?: string;
  paisWhatsapp?: string;
  whatsapp?: string;
  email?: string;
}

export interface IEndereco {
  cep?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  rua?: string;
  numero?: number;
}

export interface ICliente extends Document {
  _id: ObjectId;
  nome: string;
  cpf: string;
  observacoes?: string;
  dataNascimento?: Date;
  contato?: IContato;
  endereco?: IEndereco;
  totalVeiculos?: number;
  totalEstofados?: number;
  totalGasto?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVeiculo extends Document {
  _id: ObjectId;
  idCliente: ObjectId;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  cor?: string;
  categoria?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEstofado extends Document {
  _id: ObjectId;
  idCliente: ObjectId;
  tipo: string;
  tecido: string;
  cor?: string;
  categoria?: string;
  createdAt?: Date;
  updatedAt?: Date;
}