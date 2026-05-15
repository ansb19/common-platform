export const DATABASE_SERVICE = {
  FILE: 'FILE',
  NOTIFICATION: 'NOTIFICATION',
} as const;

export const DATABASE_SCHEMA = {
  FILE: 'file_schema',
  NOTIFICATION: 'notification_schema',
} as const;

export type DatabaseServiceName  =
  (typeof DATABASE_SERVICE)[keyof typeof DATABASE_SERVICE];