import express from 'express';
import { configDotenv } from 'dotenv';
import * as middlewares from 'middlewares/app_middleware.js';
import mongoose from 'mongoose';

configDotenv();

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

// app.use my routes
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_CONNECTION_STRING);

    console.info('Connected to Database!');

    app.listen(PORT, HOST, () => {
      console.info(`Server listening on http://localhost/${PORT}`);
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
