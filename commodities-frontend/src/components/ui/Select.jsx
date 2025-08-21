import { forwardRef } from "react";

const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = "Select an option",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-primary-500 focus:border-primary-500 
          dark:bg-gray-800 dark:border-gray-600 dark:text-white
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : ""
          }
          ${className}
        `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
