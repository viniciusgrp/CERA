import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { database } from './config/database';
import { config } from './config';
import { globalErrorHandler } from './middleware';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rota de status
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    database: database.isConnected() ? 'connected' : 'disconnected'
  });
});

app.use('/', routes);

app.use(globalErrorHandler);

async function startServer() {
  try {
    database.setupEventListeners();
    await database.connect();
    
    app.listen(config.PORT, config.HOST, () => {
      console.log(`Servidor rodando em http://${config.HOST}:${config.PORT}`);
      console.log(`Rota de STATUS: http://${config.HOST}:${config.PORT}/status`);
    });
    
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

export { app, startServer };
