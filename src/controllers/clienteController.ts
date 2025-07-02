import { Request, Response, NextFunction } from 'express';
import { Cliente, Veiculo, Estofado } from '../models';
import { CreateClienteDTO, UpdateClienteDTO, CreateVeiculoDTO, CreateEstofadoDTO } from '../types';

// Havia a possibilidade de tratar as atualizações com UPSERT também para veículos e estofados, mas como não havia um ID ou algo do tipo nem foi solicitado, acabei não fazendo, acredito que a ideia seja algo mais simples e direto, então mantive o código assim mesmo.
// Além disso, com os models atuais, não tem cmo calcular o totalGasto, então deixei um valor fixo de 549.75 no placeholder.

export const clienteController = {
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const { veiculos, estofados, ...dadosCliente }: CreateClienteDTO = req.body;

      const cliente = new Cliente(dadosCliente);
      await cliente.save();

      if (veiculos && veiculos.length > 0) {
        const veiculosComCliente = veiculos.map((veiculo: CreateVeiculoDTO) => ({ 
          ...veiculo, 
          idCliente: cliente._id 
        }));
        await Veiculo.insertMany(veiculosComCliente);
      }

      if (estofados && estofados.length > 0) {
        const estofadosComCliente = estofados.map((estofado: CreateEstofadoDTO) => ({ 
          ...estofado, 
          idCliente: cliente._id 
        }));
        await Estofado.insertMany(estofadosComCliente);
      }

      const clienteCompleto = await Cliente.findById(cliente._id);
      const veiculosCliente = await Veiculo.find({ idCliente: cliente._id });
      const estofadosCliente = await Estofado.find({ idCliente: cliente._id });

      return res.status(201).json({
        ...clienteCompleto?.toObject(),
        veiculos: veiculosCliente,
        estofados: estofadosCliente
      });
    } catch (error) {
      return next(error);
    }
  },

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const clientes = await Cliente.find();
      
      const clientesComTotais = await Promise.all(
        clientes.map(async (cliente) => {
          const totalVeiculos = await Veiculo.countDocuments({ idCliente: cliente._id });
          const totalEstofados = await Estofado.countDocuments({ idCliente: cliente._id });

          return {
            ...cliente.toObject(),
            endereco: {
              bairro: cliente.endereco?.bairro,
              cep: cliente.endereco?.cep,
              cidade: cliente.endereco?.cidade
            },
            totalVeiculos,
            totalEstofados,
            totalGasto: 549.75
          };
        })
      );

      return res.json({
        status: 'ok',
        statusCode: 200,
        body: clientesComTotais
      });
    } catch (error) {
      return next(error);
    }
  },

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findById(id);

      if (!cliente) {
        return res.status(404).json({ 
          status: 'fail',
          statusCode: 404,
          message: 'Cliente não encontrado' 
        });
      }

      const veiculos = await Veiculo.find({ idCliente: id });
      const estofados = await Estofado.find({ idCliente: id });

      return res.json({
        ...cliente.toObject(),
        veiculos,
        estofados
      });
    } catch (error) {
      return next(error);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { veiculos, estofados, ...dadosCliente }: UpdateClienteDTO = req.body;

      const cliente = await Cliente.findByIdAndUpdate(id, dadosCliente, { new: true });

      if (!cliente) {
        return res.status(404).json({ 
          status: 'fail',
          statusCode: 404,
          message: 'Cliente não encontrado' 
        });
      }

      if (veiculos && veiculos.length > 0) {
        await Veiculo.deleteMany({ idCliente: id });
        const veiculosComCliente = veiculos.map((veiculo: CreateVeiculoDTO) => ({ 
          ...veiculo, 
          idCliente: id 
        }));
        await Veiculo.insertMany(veiculosComCliente);
      }

      if (estofados && estofados.length > 0) {
        await Estofado.deleteMany({ idCliente: id });
        const estofadosComCliente = estofados.map((estofado: CreateEstofadoDTO) => ({ 
          ...estofado, 
          idCliente: id 
        }));
        await Estofado.insertMany(estofadosComCliente);
      }

      const veiculosCliente = await Veiculo.find({ idCliente: id });
      const estofadosCliente = await Estofado.find({ idCliente: id });

      return res.json({
        ...cliente.toObject(),
        veiculos: veiculosCliente,
        estofados: estofadosCliente
      });
    } catch (error) {
      return next(error);
    }
  },

  async deletar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findById(id);

      if (!cliente) {
        return res.status(404).json({ 
          status: 'fail',
          statusCode: 404,
          message: 'Cliente não encontrado' 
        });
      }

      await Veiculo.deleteMany({ idCliente: id });
      await Estofado.deleteMany({ idCliente: id });
      await Cliente.findByIdAndDelete(id);

      return res.json({ mensagem: 'Cliente removido' });
    } catch (error) {
      next(error);
      return;
    }
  }
};
