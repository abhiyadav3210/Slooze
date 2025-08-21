import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, type = "text", className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
          focus:outline-none focus:ring-primary-500 focus:border-primary-500 
          dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : ""
          }
          ${className}
        `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
