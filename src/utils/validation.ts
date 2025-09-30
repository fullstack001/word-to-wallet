/**
 * Centralized validation utilities for form validation
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

/**
 * Common validation patterns
 */
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

/**
 * Common validation messages
 */
export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} must be no more than ${max} characters`,
  pattern: (field: string) => `Please enter a valid ${field}`,
  email: "Please enter a valid email address",
  password:
    "Password must be at least 6 characters and contain at least one letter and one number",
  passwordMatch: "Passwords do not match",
  terms: "You must accept the terms and conditions",
} as const;

/**
 * Validate a single field against a rule
 */
export function validateField(
  value: any,
  rule: ValidationRule,
  fieldName: string
): string | null {
  // Required validation
  if (
    rule.required &&
    (!value || (typeof value === "string" && !value.trim()))
  ) {
    return rule.message || VALIDATION_MESSAGES.required(fieldName);
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === "string" && !value.trim())) {
    return null;
  }

  // Min length validation
  if (
    rule.minLength &&
    typeof value === "string" &&
    value.length < rule.minLength
  ) {
    return (
      rule.message || VALIDATION_MESSAGES.minLength(fieldName, rule.minLength)
    );
  }

  // Max length validation
  if (
    rule.maxLength &&
    typeof value === "string" &&
    value.length > rule.maxLength
  ) {
    return (
      rule.message || VALIDATION_MESSAGES.maxLength(fieldName, rule.maxLength)
    );
  }

  // Pattern validation
  if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
    return rule.message || VALIDATION_MESSAGES.pattern(fieldName);
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
}

/**
 * Validate an entire form against a schema
 */
export function validateForm(
  data: any,
  schema: ValidationSchema
): ValidationResult {
  const errors: { [key: string]: string } = {};

  for (const [fieldName, rule] of Object.entries(schema)) {
    const error = validateField(data[fieldName], rule, fieldName);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Common validation schemas
 */
export const VALIDATION_SCHEMAS = {
  // User authentication schemas
  login: {
    email: {
      required: true,
      pattern: VALIDATION_PATTERNS.email,
      message: VALIDATION_MESSAGES.email,
    },
    password: {
      required: true,
      minLength: 6,
      message: "Password must be at least 6 characters",
    },
  },

  signup: {
    email: {
      required: true,
      pattern: VALIDATION_PATTERNS.email,
      message: VALIDATION_MESSAGES.email,
    },
    password: {
      required: true,
      minLength: 6,
      message: "Password must be at least 6 characters",
    },
    confirmPassword: {
      required: true,
      custom: (value: string, formData?: any) => {
        if (formData && value !== formData.password) {
          return VALIDATION_MESSAGES.passwordMatch;
        }
        return null;
      },
    },
    firstName: {
      required: true,
      minLength: 1,
      message: "First name is required",
    },
    lastName: {
      required: true,
      minLength: 1,
      message: "Last name is required",
    },
    acceptTerms: {
      required: true,
      custom: (value: boolean) => (!value ? VALIDATION_MESSAGES.terms : null),
    },
  },

  // Course management schemas
  course: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 200,
      message: "Title must be between 3 and 200 characters",
    },
    description: {
      minLength: 10,
      maxLength: 1000,
      message: "Description must be at least 10 characters",
    },
    chapters: {
      custom: (chapters: any[]) => {
        if (!chapters || chapters.length === 0) {
          return "At least one chapter is required";
        }
        const validChapters = chapters.filter(
          (chapter) =>
            chapter.title?.trim() &&
            chapter.description?.trim() &&
            chapter.content?.trim()
        );
        if (validChapters.length === 0) {
          return "At least one complete chapter is required";
        }
        return null;
      },
    },
  },

  subject: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: "Subject name must be between 2 and 100 characters",
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500,
      message: "Description must be between 10 and 500 characters",
    },
  },

  chapter: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 200,
      message: "Chapter title must be between 3 and 200 characters",
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: "Chapter description must be between 10 and 1000 characters",
    },
    content: {
      required: true,
      minLength: 50,
      message: "Chapter content must be at least 50 characters",
    },
  },
} as const;

/**
 * Real-time validation for form fields
 */
export function validateFieldRealtime(
  value: any,
  rule: ValidationRule,
  fieldName: string,
  formData?: any
): string | null {
  // For real-time validation, we might want to be less strict
  // For example, don't show "required" errors until the user has interacted with the field
  if (
    rule.required &&
    (!value || (typeof value === "string" && !value.trim()))
  ) {
    return null; // Don't show required errors in real-time
  }

  // For custom validation with form data context
  if (rule.custom && typeof rule.custom === "function") {
    return rule.custom(value);
  }

  return validateField(value, rule, fieldName);
}

/**
 * Sanitize form data
 */
export function sanitizeFormData(data: any): any {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
