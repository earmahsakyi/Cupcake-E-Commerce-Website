import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testMySQLConnection, connectMongoDB } from './config/index.js';

dotenv.config(); 


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async (): Promise<void> =>  {
    
  await testMySQLConnection();
  await connectMongoDB()

  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  });
}

startServer();