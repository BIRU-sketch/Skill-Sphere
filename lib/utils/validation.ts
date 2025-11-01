import { z } from 'zod';

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['mentor', 'student'], {
    required_error: 'Please select a role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Challenge validation schemas
export const challengeSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  learningOutcomes: z.array(z.string()).min(1, 'At least one learning outcome is needed'),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string().url('Invalid URL'),
  })).optional(),
  maxParticipants: z.number().positive().optional(),
  deadline: z.date().optional(),
});

// Submission validation schemas
export const submissionSchema = z.object({
  submissionUrl: z.string().url('Invalid URL'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

// Profile validation schemas
export const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  skills: z.array(z.string()).optional(),
  expertise: z.array(z.string()).optional(),
});

// Certificate verification
export const verificationCodeSchema = z.string().length(12, 'Invalid verification code');

