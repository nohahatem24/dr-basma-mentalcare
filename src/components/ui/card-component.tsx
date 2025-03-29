
import React from 'react';
import { Card as ShadcnCard } from '@/components/ui/card';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <ShadcnCard className={className} {...props}>
      {children}
    </ShadcnCard>
  );
};
