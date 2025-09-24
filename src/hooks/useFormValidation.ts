/**
 * Custom hooks for form validation
 */

import { useState, useCallback, useEffect } from "react";
import {
  ValidationSchema,
  ValidationResult,
  validateForm,
  validateFieldRealtime,
} from "../utils/validation";

export interface UseFormValidationOptions {
  schema: ValidationSchema;
  initialData?: any;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormValidationReturn {
  data: any;
  errors: { [key: string]: string };
  isValid: boolean;
  setData: (data: any) => void;
  setField: (field: string, value: any) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  validate: () => ValidationResult;
  validateField: (field: string) => string | null;
  reset: () => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

/**
 * Hook for form validation with real-time validation
 */
export function useFormValidation({
  schema,
  initialData = {},
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormValidationOptions): UseFormValidationReturn {
  const [data, setDataState] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validate entire form
  const validate = useCallback((): ValidationResult => {
    const result = validateForm(data, schema);
    setErrors(result.errors);
    return result;
  }, [data, schema]);

  // Validate single field
  const validateField = useCallback(
    (field: string): string | null => {
      const rule = schema[field];
      if (!rule) return null;

      const error = validateFieldRealtime(data[field], rule, field, data);
      return error;
    },
    [data, schema]
  );

  // Set form data
  const setData = useCallback(
    (newData: any) => {
      setDataState(newData);
      if (validateOnChange) {
        const result = validateForm(newData, schema);
        setErrors(result.errors);
      }
    },
    [schema, validateOnChange]
  );

  // Set single field
  const setField = useCallback(
    (field: string, value: any) => {
      const newData = { ...data, [field]: value };
      setDataState(newData);

      if (validateOnChange) {
        const error = validateFieldRealtime(
          value,
          schema[field],
          field,
          newData
        );
        setErrors((prev) => ({
          ...prev,
          [field]: error || "",
        }));
      }
    },
    [data, schema, validateOnChange]
  );

  // Set error for specific field
  const setError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  // Clear error for specific field
  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Handle input change
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      const fieldValue = type === "checkbox" ? checked : value;
      setField(name, fieldValue);
    },
    [setField]
  );

  // Handle input blur
  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validateOnBlur) {
        const error = validateField(name);
        setErrors((prev) => ({
          ...prev,
          [name]: error || "",
        }));
      }
    },
    [validateField, validateOnBlur]
  );

  // Reset form
  const reset = useCallback(() => {
    setDataState(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Calculate if form is valid
  const isValid =
    Object.keys(errors).length === 0 &&
    Object.values(data).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

  return {
    data,
    errors,
    isValid,
    setData,
    setField,
    setError,
    clearError,
    clearAllErrors,
    validate,
    validateField,
    reset,
    handleChange,
    handleBlur,
  };
}

/**
 * Hook for simple field validation
 */
export function useFieldValidation(
  initialValue: any = "",
  rule: any,
  fieldName: string
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validate = useCallback(() => {
    const fieldError = validateFieldRealtime(value, rule, fieldName);
    setError(fieldError);
    return !fieldError;
  }, [value, rule, fieldName]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Clear error when user starts typing
      if (error) {
        setError(null);
      }
    },
    [error]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    validate();
  }, [validate]);

  return {
    value,
    error,
    touched,
    setValue,
    setError,
    validate,
    handleChange,
    handleBlur,
  };
}

/**
 * Hook for form submission with validation
 */
export function useFormSubmission<T>(
  validationHook: UseFormValidationReturn,
  onSubmit: (data: T) => Promise<void> | void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      setIsSubmitting(true);

      try {
        const validationResult = validationHook.validate();
        if (!validationResult.isValid) {
          return;
        }

        await onSubmit(validationHook.data);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [validationHook, onSubmit]
  );

  return {
    isSubmitting,
    submitError,
    setSubmitError,
    handleSubmit,
  };
}
