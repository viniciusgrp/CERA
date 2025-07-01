import { Schema, model, Types } from 'mongoose';
import { IEstofado } from '../types';

const EstofadoSchema = new Schema<IEstofado>({
  idCliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'Cliente é obrigatório']
  },
  tipo: {
    type: String,
    required: [true, 'Tipo é obrigatório'],
    trim: true,
    uppercase: true
  },
  tecido: {
    type: String,
    required: [true, 'Tecido é obrigatório'],
    trim: true,
    uppercase: true
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

EstofadoSchema.index({ idCliente: 1 });
EstofadoSchema.index({ tipo: 1 });

export const Estofado = model<IEstofado>('Estofado', EstofadoSchema);