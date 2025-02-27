'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
  className?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  asChild?: boolean
}

export function CustomButton({
  variant,
  className,
  isLoading,
  children,
  asChild,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        'h-[48px] py-3 rounded-[100px] font-medium text-base transition-colors duration-200',
        variant === 'primary' && 'bg-brand-secondary text-white hover:bg-brand-secondary/90',
        variant === 'secondary' && 'bg-white border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10',
        className
      )}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent uppercase" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}