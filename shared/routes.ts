
import { z } from 'zod';
import { insertVerificationSchema, verifications } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  verifications: {
    create: {
      method: 'POST' as const,
      path: '/api/verifications' as const,
      // Note: Actual input is FormData, but we use this schema for the non-file fields validation
      input: insertVerificationSchema.pick({ referenceNumber: true, welfareScheme: true }), 
      responses: {
        201: z.custom<typeof verifications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/verifications/:id' as const,
      responses: {
        200: z.custom<typeof verifications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/verifications' as const,
      responses: {
        200: z.array(z.custom<typeof verifications.$inferSelect>()),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
