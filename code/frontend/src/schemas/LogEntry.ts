export type LogEntry = {
  level: 'info' | 'warn' | 'error';
  event: string;
  message: string;
  correlationId?: string;
};
