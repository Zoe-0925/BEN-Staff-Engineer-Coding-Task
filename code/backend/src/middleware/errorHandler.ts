import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const isMalformedJson =
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400 &&
    'type' in error &&
    error.type === 'entity.parse.failed';

  if (isMalformedJson) {
    response.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Check the loan details and try again.',
      },
    });
    return;
  }

  request.log.error(
    {
      errorType: error instanceof Error ? error.name : 'UnknownError',
    },
    'Unhandled request error',
  );
  response.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please contact your administrator.',
    },
  });
};
