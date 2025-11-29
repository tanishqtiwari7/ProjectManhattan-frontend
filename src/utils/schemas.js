import { z } from 'zod';

export const cafSubmissionSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    cafId: z.number(),
    status: z.enum(['pending', 'approved', 'rejected']),
    submittedAt: z.string(),
  }),
});

export const cafUpdateSchema = cafSubmissionSchema;

export const cafStatusSchema = z.object({
  success: z.boolean(),
  data: z.object({
    status: z.enum(['not_submitted', 'pending', 'approved', 'rejected']),
  }),
});

export const notificationListSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    id: z.number(),
    type: z.enum(['new_caf', 'edit_request']),
    studentId: z.number(),
    studentName: z.string(),
    timestamp: z.string(),
    details: z.any(),
  })),
});

export const approvalSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const rejectionSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const studentListSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    id: z.number(),
    enrollmentNo: z.string(),
    fullName: z.string(),
    branch: z.string(),
    currentCGPA: z.number(),
    tenthPercent: z.number(),
    twelfthPercent: z.number(),
  })),
});

export const companyListSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    companyId: z.number(),
    companyName: z.string(),
    location: z.string(),
    jobDescription: z.string(),
    eligibilityCriteria: z.object({
      minCGPA: z.number(),
      allowedBranches: z.array(z.string()),
      maxBacklogs: z.number(),
    }),
  })),
});

export const uploadResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const mockResultSchema = z.object({
  success: z.boolean(),
  data: z.object({
    selected: z.boolean(),
    rejectedAt: z.string().optional(),
    rounds: z.object({
      gd: z.boolean().optional(),
      hr: z.boolean().optional(),
      technical: z.boolean().optional(),
    }),
  }),
});

export const internshipSchema = z.object({
  success: z.boolean(),
  data: z.object({
    companyName: z.string(),
    internshipType: z.string(),
    duration: z.string(),
    stipend: z.string(),
    hasPPO: z.boolean(),
  }),
});

export const internshipListSchema = z.object({
  success: z.boolean(),
  data: z.array(internshipSchema.shape.data),
});
