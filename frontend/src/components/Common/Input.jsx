import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  success,
  helperText,
  className = '',
  required = false,
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors';
  
  const getStateClasses = () => {
    if (error) {
      return 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500';
    }
    if (success) {
      return 'border-green-300 text-green-900 focus:ring-green-500 focus:border-green-500';
    }
    if (disabled) {
      return 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed';
    }
    return 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500';
  };
  
  const inputClasses = `${baseClasses} ${getStateClasses()} ${className}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        className={inputClasses}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        {...props}
      />
      
      {(error || success || helperText) && (
        <div className="text-sm">
          {error && <p className="text-red-600">{error}</p>}
          {success && !error && <p className="text-green-600">{success}</p>}
          {helperText && !error && !success && <p className="text-gray-500">{helperText}</p>}
        </div>
      )}
    </div>
  );
};

export default Input;