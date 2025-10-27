import React, { forwardRef } from 'react';

// Utility function
const mergeClasses = (...classes: (string | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Props interface for the SiticGridButton component
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text content */
  text?: string;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning';
  /** Size of the button */
  size?: 'small' | 'medium' | 'large';
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Icon to display after text */
  iconAfter?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Rounded corners */
  rounded?: boolean;
  /** Children elements (takes precedence over text prop) */
  children?: React.ReactNode;
}

/**
 * SiticGridButton - A flexible button component with multiple variants and states
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  text,
  variant = 'primary', 
  size = 'medium',
  icon,
  iconAfter,
  loading = false,
  fullWidth = false,
  rounded = false,
  className,
  children,
  disabled,
  ...props 
}, ref) => {

  const baseClasses = 'font-medium transition-all duration-200 text-center no-underline inline-flex items-center justify-center gap-2 outline-none cursor-pointer border font-inherit focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-700 focus:ring-gray-500',
    outline: 'bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 focus:ring-yellow-500'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs min-h-[28px]',
    medium: 'px-4 py-2 text-sm min-h-[36px]',
    large: 'px-6 py-3 text-base min-h-[44px]'
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';
  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = mergeClasses(
    'sitic-grid-button',
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses,
    widthClasses,
    className
  );

  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const content = children || text;

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoadingSpinner /> : icon}
      {content && <span>{content}</span>}
      {!loading && iconAfter}
    </button>
  );
});

Button.displayName = 'SiticGridButton';