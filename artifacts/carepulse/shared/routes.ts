import { z } from 'zod';
import { insertHospitalSchema, insertPatientSchema, insertVitalSchema, hospitals, patients, vitals, diseaseTrends } from './schema';

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
  hospitals: {
    list: {
      method: 'GET' as const,
      path: '/api/hospitals',
      responses: {
        200: z.array(z.custom<typeof hospitals.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/hospitals/:id',
      responses: {
        200: z.custom<typeof hospitals.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  patients: {
    list: {
      method: 'GET' as const,
      path: '/api/patients',
      responses: {
        200: z.array(z.custom<typeof patients.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/patients/:id',
      responses: {
        200: z.custom<typeof patients.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    vitals: {
      method: 'GET' as const,
      path: '/api/patients/:id/vitals',
      responses: {
        200: z.array(z.custom<typeof vitals.$inferSelect>()),
      },
    }
  },
  analytics: {
    trends: {
      method: 'GET' as const,
      path: '/api/analytics/trends',
      responses: {
        200: z.array(z.custom<typeof diseaseTrends.$inferSelect>()),
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/analytics/stats',
      responses: {
        200: z.object({
          totalPatients: z.number(),
          criticalPatients: z.number(),
          totalHospitals: z.number(),
          activeAlerts: z.number(),
        }),
      },
    }
  },
  knowledge: {
    search: {
      method: 'POST' as const,
      path: '/api/knowledge/search',
      input: z.object({
        query: z.string(),
      }),
      responses: {
        200: z.object({
          answer: z.string(),
          disclaimer: z.string(),
        }),
      },
    }
  }
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
