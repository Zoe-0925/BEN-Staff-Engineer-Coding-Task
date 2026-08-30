import cors from 'cors';
import express from 'express';

import { apiKeyAuth } from './middleware/apiKeyAuth';
import { httpLogger } from './middleware/httpLogger';
import { createCommissionQuoteRouter } from './routes/createCommissionQuoteRoute';

export const app = express();

app.use(httpLogger);
app.use(
  cors({
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'api-key', 'x-correlation-id'],
    exposedHeaders: ['x-correlation-id'],
    credentials: false,
  }),
);
app.use(apiKeyAuth);
app.use(express.json());
app.use(createCommissionQuoteRouter);
