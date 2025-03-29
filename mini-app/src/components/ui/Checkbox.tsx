import React, { forwardRef } from "react";

interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "className" | "type"
  > {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      hint,
      className = "",
      containerClassName = "",
      labelClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex items-start ${containerClassName}`}>
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            ref={ref}
            className={`
              h-4 w-4 rounded border-border text-accent 
              focus:ring-1 focus:ring-accent focus:ring-offset-0
              cursor-pointer transition-all
              ${error ? "border-error-color" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        <div className="ml-2">
          {label && (
            <label
              className={`text-sm text-text cursor-pointer ${labelClassName}`}
              onClick={() => {
                if (props.id && !props.disabled) {
                  const checkbox = document.getElementById(
                    props.id
                  ) as HTMLInputElement;
                  if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    const event = new Event("change", { bubbles: true });
                    checkbox.dispatchEvent(event);
                  }
                }
              }}
            >
              {label}
            </label>
          )}
          {error && <p className="mt-0.5 text-xs text-error-color">{error}</p>}
          {hint && !error && (
            <p className="mt-0.5 text-xs text-text-secondary">{hint}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
