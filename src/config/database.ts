import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private static instance: Database;
  private connectionString: string;

  private constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/cera-db';
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      console.log('Conectando ao MongoDB...');
      await mongoose.connect(this.connectionString);
      console.log('MongoDB conectado!');
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('MongoDB desconectado!');
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      throw error;
    }
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public setupEventListeners(): void {
    mongoose.connection.on('error', (error) => {
      console.error('Erro:', error);
    });

    process.on('SIGINT', async () => {
      console.log('Encerrando aplicação...');
      await this.disconnect();
      process.exit(0);
    });
  }
}

export const database = Database.getInstance();
