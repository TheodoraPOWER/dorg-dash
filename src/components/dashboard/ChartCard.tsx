import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const ChartCard = ({ 
  title, 
  subtitle, 
  children, 
  className 
}: ChartCardProps) => {
  return (
    <Card className={cn(
      'p-6 bg-card/50 backdrop-blur-sm col-span-full lg:col-span-2',
      className
    )}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <div className="h-64">
        {children}
      </div>
    </Card>
  );
};