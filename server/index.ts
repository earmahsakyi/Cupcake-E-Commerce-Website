import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { getClientIp } from './middleware/getClientIp.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import cookieParser from 'cookie-parser';
import { testMySQLConnection, connectMongoDB } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import webhookRouter from './routes/webhookRoutes.js';
import authRouter from './routes/authRoutes.js';
import smsRouter from './routes/smsRoutes.js'
import paymentsRouter from './routes/paymentsRoutes.js'
import transactionsRouter from './routes/transactionsRoutes.js'

dotenv.config(); 


const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(helmet());
app.use(getClientIp);
app.use('/api/',apiLimiter);
app.use('/api/webhook',express.raw({type: 'application/json'}));
app.use(express.json());



app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

//routes goes on here
app.use('/api/products',productRouter);
app.use('/api/orders',orderRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/auth', authRouter);
app.use('/api/sms', smsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/transactions', transactionsRouter);

app.use(errorHandler)

const startServer = async (): Promise<void> =>  {
    
  await testMySQLConnection();
  await connectMongoDB()

  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  });
}

startServer();
