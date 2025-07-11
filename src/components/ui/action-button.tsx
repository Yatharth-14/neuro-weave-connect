
import React from 'react';
import { cn } from '../../lib/utils';

interface ActionButtonProps {
  onClick?: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  className,
  children,
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
};

export default ActionButton;
