import type { RequestHandler } from 'express';

export const apiKeyAuth: RequestHandler = (request, response, next) => {
  const apiKey = request.header('api-key');
  const expectedApiKey = process.env.COMMISSION_QUOTE_API_KEY;

  if (!apiKey || !expectedApiKey || apiKey !== expectedApiKey) {
    response.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: "We couldn't authenticate the quote request. Please contact your administrator.",
      },
    });
    return;
  }

  next();
};
