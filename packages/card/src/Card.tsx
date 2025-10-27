import React, { forwardRef } from 'react';

// Utility function
const mergeClasses = (...classes: (string | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Props interface for the SiticGridCard component
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: React.ReactNode;
  /** Shadow depth */
  shadow?: 'none' | 'small' | 'medium' | 'large' | 'xl';
  /** Padding size */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Header content */
  header?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Card image */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Card variant */
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  /** Hover effects */
  hoverable?: boolean;
  /** Clickable card */
  clickable?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Click handler for clickable cards */
  onCardClick?: () => void;
}

/**
 * SiticGridCard - A flexible card component with multiple variants and features
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children,
  shadow = 'medium',
  padding = 'medium',
  header,
  footer,
  title,
  subtitle,
  image,
  imageAlt,
  variant = 'default',
  hoverable = false,
  clickable = false,
  loading = false,
  onCardClick,
  className,
  style,
  ...props 
}, ref) => {
  const baseClasses = 'bg-white rounded-lg block w-full relative transition-all duration-200';

  const variantClasses = {
    default: 'border border-gray-200',
    outlined: 'border-2 border-gray-300',
    elevated: 'border-0',
    filled: 'border-0 bg-gray-50'
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const interactionClasses = mergeClasses(
    hoverable ? 'hover:shadow-lg hover:-translate-y-1' : null,
    clickable ? 'cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : null
  );

  const cardClasses = mergeClasses(
    'sitic-grid-card',
    baseClasses,
    variantClasses[variant],
    shadowClasses[shadow],
    interactionClasses,
    loading ? 'animate-pulse' : null,
    className
  );

  const contentPaddingClass = paddingClasses[padding];

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-20 bg-gray-300 rounded"></div>
    </div>
  );

  const handleClick = () => {
    if (clickable && onCardClick) {
      onCardClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={ref}
      className={cardClasses}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      {...props}
    >
      {/* Image */}
      {image && (
        <div className="sitic-grid-card-image">
          <img 
            src={image} 
            alt={imageAlt || title || 'Card image'} 
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </div>
      )}

      {/* Header */}
      {(header || title || subtitle) && (
        <div 
          className={mergeClasses(
            'sitic-grid-card-header', 
            'border-b border-gray-200',
            contentPaddingClass
          )}
        >
          {header || (
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div 
        className={mergeClasses('sitic-grid-card-content', contentPaddingClass)}
      >
        {loading ? <LoadingSkeleton /> : children}
      </div>

      {/* Footer */}
      {footer && (
        <div 
          className={mergeClasses(
            'sitic-grid-card-footer',
            'border-t border-gray-200 text-sm text-gray-600',
            contentPaddingClass
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'SiticGridCard';