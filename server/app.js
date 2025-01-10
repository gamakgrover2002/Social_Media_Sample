import express from 'express';
import cors from 'cors';

// creating app using express
const app = express();

// exporting common middlewares
app.use(express.json());
app.use(cors());


import eventRouter from './routes/events.routes.js';



app.use("/api/v1/events", eventRouter);

export { app };
