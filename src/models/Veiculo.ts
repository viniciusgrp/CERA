import { Schema, model, Types } from 'mongoose';
import { IVeiculo } from '../types';

const VeiculoSchema = new Schema<IVeiculo>({
  idCliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'Cliente é obrigatório']
  },
  marca: {
    type: String,
    required: [true, 'Marca é obrigatória'],
    trim: true,
    uppercase: true
  },
  modelo: {
    type: String,
    required: [true, 'Modelo é obrigatório'],
    trim: true,
    uppercase: true
  },
  placa: {
    type: String,
    required: [true, 'Placa é obrigatória'],
    trim: true,
    uppercase: true,
    unique: true
  },
  ano: {
    type: Number,
    required: [true, 'Ano é obrigatório'],
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  cor: {
    type: String,
    trim: true
  },
  categoria: {
    type: String,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
});

VeiculoSchema.index({ idCliente: 1 });
VeiculoSchema.index({ placa: 1 });

export const Veiculo = model<IVeiculo>('Veiculo', VeiculoSchema);
