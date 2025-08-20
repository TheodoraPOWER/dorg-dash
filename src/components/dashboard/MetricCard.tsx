import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  status = 'neutral',
  className 
}: MetricCardProps) => {
  const statusColors = {
    success: 'border-l-success',
    warning: 'border-l-warning', 
    danger: 'border-l-danger',
    neutral: 'border-l-muted'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-danger',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card className={cn(
      'p-6 border-l-4 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300',
      statusColors[status],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && <div className="text-muted-foreground">{icon}</div>}
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          <div className="text-2xl font-bold text-card-foreground mb-1">
            {value}
          </div>
          {subtitle && (
            <p className={cn(
              'text-sm',
              trend ? trendColors[trend] : 'text-muted-foreground'
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};