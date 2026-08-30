import 'dotenv/config';

import { app } from './app';

const portValue = process.env.PORT;
const commissionQuoteApiKey = process.env.COMMISSION_QUOTE_API_KEY;
const mockApiErrorCode = process.env.MOCK_API_ERROR_CODE;

if (!portValue) {
  throw new Error('PORT must be configured.');
}

const port = Number(portValue);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

if (!commissionQuoteApiKey || commissionQuoteApiKey.trim().length === 0) {
  throw new Error('COMMISSION_QUOTE_API_KEY must be configured.');
}

if (mockApiErrorCode && mockApiErrorCode !== '500' && mockApiErrorCode !== '503') {
  throw new Error('MOCK_API_ERROR_CODE must be unset, 500, or 503.');
}

app.listen(port);
