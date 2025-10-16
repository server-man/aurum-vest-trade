import { z } from 'zod';

/**
 * Input validation schemas for the application
 * Using Zod for type-safe runtime validation
 */

// Email template validation
export const emailTemplateSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  html_content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(50000, 'Content is too large'),
  variables: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
});

// Notification validation
export const notificationSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
  type: z.enum(['info', 'success', 'warning', 'error', 'signal', 'trade', 'kyc']),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
  send_push: z.boolean().default(false),
});

// CMS content validation
export const cmsContentSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(100000, 'Content is too large'),
  meta_description: z.string()
    .max(160, 'Meta description must be less than 160 characters')
    .optional(),
  meta_keywords: z.array(z.string()).optional(),
  is_published: z.boolean().default(false),
  publish_date: z.string().datetime().optional(),
  category: z.string().optional(),
});

// Sanitize HTML content (basic sanitization)
export function sanitizeHtml(html: string): string {
  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
  
  return sanitized.trim();
}

// Sanitize text input
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

// Validate and sanitize email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate URL
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Helper function to validate and return email template
export function validateEmailTemplate(data: unknown): EmailTemplateInput {
  return emailTemplateSchema.parse(data);
}

// Helper function to validate and return notification
export function validateNotification(data: unknown): NotificationInput {
  return notificationSchema.parse(data);
}

// Helper function to validate and return CMS content
export function validateCmsContent(data: unknown): CmsContentInput {
  return cmsContentSchema.parse(data);
}

export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>;
export type NotificationInput = z.infer<typeof notificationSchema>;
export type CmsContentInput = z.infer<typeof cmsContentSchema>;
