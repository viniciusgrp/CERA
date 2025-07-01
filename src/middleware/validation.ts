import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { AppError } from './errorHandler';

// Verifica se há erros de validação
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const messages = errors.array().map(error => error.msg);
    return next(new AppError(`Dados inválidos: ${messages.join(', ')}`, 400));
  }
  
  next();
};

export const validateCliente = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('cpf')
    .notEmpty()
    .withMessage('CPF é obrigatório')
    .trim(),
  
  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações devem ter no máximo 500 caracteres')
    .trim(),
  
  body('contato.email')
    .optional()
    .isEmail()
    .withMessage('Email deve ter formato válido'),
  
  handleValidationErrors
];

export const validateVeiculo = [
  body('marca')
    .notEmpty()
    .withMessage('Marca é obrigatória')
    .trim(),
  
  body('modelo')
    .notEmpty()
    .withMessage('Modelo é obrigatório')
    .trim(),
  
  body('placa')
    .notEmpty()
    .withMessage('Placa é obrigatória')
    .trim(),
  
  body('ano')
    .notEmpty()
    .withMessage('Ano é obrigatório')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Ano inválido'),
  
  handleValidationErrors
];

export const validateEstofado = [
  body('tipo')
    .notEmpty()
    .withMessage('Tipo é obrigatório')
    .trim(),
  
  body('tecido')
    .notEmpty()
    .withMessage('Tecido é obrigatório')
    .trim(),
  
  handleValidationErrors
];

export const validateObjectId = (paramName: string = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage('ID inválido'),
  
  handleValidationErrors
];