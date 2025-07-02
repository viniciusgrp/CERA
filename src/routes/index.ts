import { Router } from 'express';
import { clienteController } from '../controllers/clienteController';

const router = Router();

router.post('/clientes', clienteController.criar);
router.get('/clientes', clienteController.listar);
router.get('/clientes/:id', clienteController.buscarPorId);
router.put('/clientes/:id', clienteController.atualizar);
router.delete('/clientes/:id', clienteController.deletar);

export default router;
