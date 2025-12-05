/**
 * Reusable form field component with built-in validation
 */

import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select';
  value: any;
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

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  options = [],
  rows = 4,
  className = '',
  inputClassName = '',
  labelClassName = '',
  errorClassName = '',
  showError = true,
  helpText,
  icon,
  rightIcon,
  onRightIconClick,
}: FormFieldProps) {
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${inputClassName}
  `;

  const renderInput = () => {
    const commonProps = {
      name,
      value: value || '',
      onChange,
      onBlur,
      placeholder,
      disabled,
      required,
      className: baseInputClasses,
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className={`${baseInputClasses} resize-vertical`}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
          />
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{icon}</div>
          </div>
        )}

        <div className={icon ? 'pl-10' : ''}>
          {renderInput()}
        </div>

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={onRightIconClick}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {rightIcon}
            </button>
          </div>
        )}
      </div>

      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}

      {showError && error && (
        <div className={`flex items-center space-x-1 text-sm text-red-600 ${errorClassName}`}>
          <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Specialized form field components
 */

export function EmailField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="email" />;
}

interface PasswordFieldProps extends Omit<FormFieldProps, 'type'> {
  inputType?: 'password' | 'text';
}

export function PasswordField({
  inputType = 'password',
  ...rest
}: PasswordFieldProps) {
  return <FormField {...rest} type={inputType} />;
}

export function TextAreaField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="textarea" />;
}

export function SelectField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="select" />;
}

export function NumberField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="number" />;
}
