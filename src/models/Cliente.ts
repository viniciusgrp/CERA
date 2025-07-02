import { Schema, model } from 'mongoose';
import { ICliente, IContato, IEndereco } from '../types';

const ContatoSchema = new Schema<IContato>({
  codigoDDIWhatsapp: {
    type: String,
    trim: true
  },
  paisWhatsapp: {
    type: String,
    trim: true
  },
  whatsapp: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        if (!email) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Email inválido'
    }
  }
}, { _id: false });

const EnderecoSchema = new Schema<IEndereco>({
  cep: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    trim: true,
    uppercase: true
  },
  cidade: {
    type: String,
    trim: true
  },
  bairro: {
    type: String,
    trim: true
  },
  rua: {
    type: String,
    trim: true
  },
  numero: {
    type: Number,
    min: 0
  }
}, { _id: false });

const ClienteSchema = new Schema<ICliente>({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [3, 'Nome muito curto']
  },
  cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    trim: true,
    unique: true,
    validate: {
      validator: function(cpf: string) {
        const cleanCpf = cpf.replace(/[^\d]/g, '');
        return cleanCpf.length === 11;
      },
      message: 'CPF inválido'
    }
  },
  observacoes: {
    type: String,
    trim: true,
    maxlength: [300, 'Observações muito longas']
  },
  dataNascimento: {
    type: Date,
    validate: {
      validator: function(date: Date) {
        if (!date) return true;
        return date <= new Date();
      },
      message: 'Data inválida'
    }
  },
  contato: {
    type: ContatoSchema,
    default: {}
  },
  endereco: {
    type: EnderecoSchema,
    default: {}
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

// Middleware para formatar CPF antes de salvar
ClienteSchema.pre('save', function(next) {
  if (this.cpf) {
    const cleanCpf = this.cpf.replace(/[^\d]/g, '');
    if (cleanCpf.length === 11) {
      this.cpf = cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
  }
  next();
});

ClienteSchema.index({ cpf: 1 });
ClienteSchema.index({ nome: 1 });
ClienteSchema.index({ 'contato.email': 1 });

export const Cliente = model<ICliente>('Cliente', ClienteSchema);
