import express from 'express';
import cors from 'cors';

// creating app using express
const app = express();

// exporting common middlewares
app.use(express.json());
app.use(cors());

export  {app};