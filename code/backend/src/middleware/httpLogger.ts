import { randomUUID } from 'node:crypto';

import type { RequestHandler } from 'express';
import type { SerializedRequest, SerializedResponse } from 'pino';
import pinoHttp from 'pino-http';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const requestLogger = pinoHttp({
  serializers: {
    req(request: SerializedRequest) {
      return {
        id: request.id,
        method: request.method,
        url: request.url,
        remoteAddress: request.remoteAddress,
        remotePort: request.remotePort,
      };
    },
    res(response: SerializedResponse) {
      return {
        statusCode: response.statusCode,
      };
    },
  },
  genReqId(request) {
    const requestedCorrelationId = request.headers['x-correlation-id'];

    if (typeof requestedCorrelationId === 'string' && UUID_PATTERN.test(requestedCorrelationId)) {
      return requestedCorrelationId;
    }

    return randomUUID();
  },
  customLogLevel(_request, response, error) {
    if (error || response.statusCode >= 500) {
      return 'error';
    }

    if (response.statusCode >= 400) {
      return 'warn';
    }

    return 'info';
  },
  customProps(request) {
    return {
      correlationId: request.id,
    };
  },
});

export const httpLogger: RequestHandler = (request, response, next) => {
  requestLogger(request, response, () => {
    const correlationId = typeof request.id === 'string' ? request.id : randomUUID();

    request.id = correlationId;
    response.setHeader('x-correlation-id', correlationId);
    next();
  });
};
