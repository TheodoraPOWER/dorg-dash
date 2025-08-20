import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, DollarSign, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Mock sparkline data
const sparklineData = Array.from({ length: 24 }, (_, i) => ({
  value: 99.8 + Math.random() * 0.4
}));

const errorSparklineData = Array.from({ length: 60 }, (_, i) => ({
  value: Math.random() * 2
}));

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  status: 'success' | 'warning' | 'danger' | 'neutral';
  showSparkline?: boolean;
  sparklineData?: Array<{ value: number }>;
  trend?: 'up' | 'down';
  unit?: string;
}

const KPICard = ({ title, value, subtitle, icon, status, showSparkline, sparklineData, trend, unit }: KPICardProps) => {
  const statusColors = {
    success: 'bg-success/10 border-success/20',
    warning: 'bg-warning/10 border-warning/20',
    danger: 'bg-danger/10 border-danger/20',
    neutral: 'bg-card/50 border-border'
  };

  const valueColors = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    neutral: 'text-card-foreground'
  };

  return (
    <Card className={`p-4 ${statusColors[status]} backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-md bg-${status}/20`}>
              {icon}
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${valueColors[status]}`}>
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
            {trend && (
              <div className={`flex items-center ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {showSparkline && sparklineData && (
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={status === 'success' ? 'hsl(var(--success))' : 'hsl(var(--danger))'} 
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};

export const KPIHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">KPIs Principales</h2>
          <p className="text-sm text-muted-foreground">Métricas críticas en tiempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">En vivo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Disponibilidad Transacciones"
          value="99.98%"
          subtitle="Últimas 24h • ↑ 0.03% vs ayer"
          icon={<Activity className="w-4 h-4 text-success" />}
          status="success"
          showSparkline={true}
          sparklineData={sparklineData}
          trend="up"
        />
        
        <KPICard
          title="Tasa Error Sistema"
          value="0.02%"
          subtitle="Último minuto • 12 errores"
          icon={<AlertTriangle className="w-4 h-4 text-success" />}
          status="success"
          showSparkline={true}
          sparklineData={errorSparklineData}
          trend="down"
        />
        
        <KPICard
          title="Fraude Detectado"
          value="$24,580"
          subtitle="Hoy • 14 transacciones bloqueadas"
          icon={<DollarSign className="w-4 h-4 text-warning" />}
          status="warning"
          unit="USD"
        />
        
        <KPICard
          title="Incidentes Mayores"
          value="2"
          subtitle="1 crítico, 1 alto • MTTR: 2.3h"
          icon={<AlertCircle className="w-4 h-4 text-danger" />}
          status="danger"
        />
      </div>
    </div>
  );
};