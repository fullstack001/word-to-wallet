/**
 * TypeScript types for validation system
 */

import { ValidationSchema, ValidationResult } from '../utils/validation';

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface CourseFormData {
  title: string;
  description?: string;
  subjectId: string;
  chapters: ChapterFormData[];
  epubCover?: File;
  multimediaContent?: any[];
  googleDocLink?: string;
  googleClassroomLink?: string;
}

export interface ChapterFormData {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface SubjectFormData {
  name: string;
  description: string;
}

// Form error types
export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface SignupFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  acceptTerms?: string;
  general?: string;
}

export interface CourseFormErrors {
  title?: string;
  description?: string;
  subjectId?: string;
  chapters?: string;
  general?: string;
}

export interface SubjectFormErrors {
  name?: string;
  description?: string;
  general?: string;
}

// Validation hook types
export interface ValidationHookOptions<T> {
  schema: ValidationSchema;
  initialData?: T;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface ValidationHookReturn<T> {
  data: T;
  errors: Record<keyof T, string>;
  isValid: boolean;
  setData: (data: T) => void;
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  validate: () => ValidationResult;
  validateField: (field: keyof T) => string | null;
  reset: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Form component props
export interface FormFieldProps<T = any> {
  name: keyof T;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select';
  value: T[keyof T];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  showError?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export interface ValidatedFormProps<T = any> {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  validation: ValidationHookReturn<T>;
  className?: string;
  showGeneralError?: boolean;
  generalError?: string;
  loading?: boolean;
}

// Validation result types
export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult<T> {
  isValid: boolean;
  errors: Record<keyof T, string>;
  validData?: T;
}

// Validation rule types
export interface ValidationRuleConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any, formData?: any) => string | null;
  message?: string;
}

// Form submission types
export interface FormSubmissionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onValidationError?: (errors: Record<keyof T, string>) => void;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  resetOnSuccess?: boolean;
}

export interface FormSubmissionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<keyof T, string>;
}

// Utility types
export type FormDataKeys<T> = keyof T;
export type FormErrorKeys<T> = keyof T;
export type FormValue<T, K extends keyof T> = T[K];

// Generic form types
export interface GenericFormData {
  [key: string]: any;
}

export interface GenericFormErrors {
  [key: string]: string;
}

// Validation context types
export interface ValidationContextType<T = any> {
  data: T;
  errors: Record<keyof T, string>;
  isValid: boolean;
  setData: (data: T) => void;
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  validate: () => ValidationResult;
  validateField: (field: keyof T) => string | null;
  reset: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}
