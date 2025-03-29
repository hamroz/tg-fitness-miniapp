import React, { forwardRef } from "react";

interface SwitchProps
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

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
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
      <div className={`${containerClassName}`}>
        <div className="flex items-center">
          <div className="relative inline-flex items-center">
            <input type="checkbox" ref={ref} className="sr-only" {...props} />
            <div
              className={`
                w-10 h-5 rounded-full relative bg-gray-300 
                transition-colors duration-200 ease-in-out cursor-pointer
                ${props.checked ? "bg-accent" : "bg-border"}
                ${className}
              `}
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
              <span
                className={`
                  absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full 
                  transform transition-transform duration-200 ease-in-out
                  ${props.checked ? "translate-x-5" : "translate-x-0"}
                  ${props.disabled ? "bg-gray-200" : "bg-white"}
                `}
              />
            </div>
          </div>
          {label && (
            <label
              className={`ml-2 text-sm text-text cursor-pointer ${labelClassName}`}
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
        </div>
        {error && <p className="mt-1 text-xs text-error-color">{error}</p>}
        {hint && !error && (
          <p className="mt-1 text-xs text-text-secondary">{hint}</p>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
