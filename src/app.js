import express from 'express';
import { configDotenv } from 'dotenv';
import * as http from 'node:http';
import { Server } from 'socket.io';
import * as middlewares from './middlewares/app_middleware.js';
import mongoose from 'mongoose';
import classesRouter from './routes/classes.js';
import bookingsRouter from './routes/bookings.js';
import blocksRouter from './routes/blocks.js';
import feedbackRouter from './routes/feedback.js';
import morgan from 'morgan';
import socketInit from './sockets/class_socket.js';
import setupCronJobs from './utils/cron_job.js';
import cors from 'cors';

configDotenv();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const API_URL = process.env.API_URL;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const WHITELISTED_DOMAINS = process.env.WHITELISTED_DOMAINS?.split(',') || [];

app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: (origin, callback) => {
      if (WHITELISTED_DOMAINS.some((domain) => domain.trim() === origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(`${API_URL}/classes`, classesRouter);
app.use(`${API_URL}/bookings`, bookingsRouter);
app.use(`${API_URL}/blocks`, blocksRouter);
app.use(`${API_URL}/feedback`, feedbackRouter);

socketInit(io);
setupCronJobs(io);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

async function startServer() {
  try {
    console.info('Attempting connection to Database...');
    await mongoose.connect(MONGODB_CONNECTION_STRING);

    console.info('Connected to Database!');

    server.listen(PORT, HOST, () => {
      console.info(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error.message || error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error('Unhandled error in startServer:', error);
  process.exit(1);
});
