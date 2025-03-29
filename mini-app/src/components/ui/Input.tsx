import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      endAdornment,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-3 py-2.5 border rounded-lg bg-paper text-text
              focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent
              transition-all
              ${error ? "border-error-color" : "border-border"}
              ${icon ? "pl-10" : ""}
              ${endAdornment ? "pr-10" : ""}
              ${className}
            `}
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {endAdornment}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-error-color">{error}</p>}
        {hint && !error && (
          <p className="mt-1 text-xs text-text-secondary">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    label?: string;
    error?: string;
    hint?: string;
    className?: string;
    containerClassName?: string;
  }
>(
  (
    { label, error, hint, className = "", containerClassName = "", ...props },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2.5 border rounded-lg bg-paper text-text
            focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent
            resize-none transition-all
            ${error ? "border-error-color" : "border-border"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-error-color">{error}</p>}
        {hint && !error && (
          <p className="mt-1 text-xs text-text-secondary">{hint}</p>
        )}
      </div>
    );
  }
);
