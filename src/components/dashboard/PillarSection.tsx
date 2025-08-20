import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PillarSectionProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export const PillarSection = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  className 
}: PillarSectionProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      <Card className="p-6 bg-primary/10 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
};