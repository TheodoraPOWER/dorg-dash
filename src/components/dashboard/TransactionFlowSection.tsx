import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const funnelData = [
  { stage: 'Inicio', count: 100000, percentage: 100, color: 'hsl(var(--success))' },
  { stage: 'Gateway', count: 99850, percentage: 99.85, color: 'hsl(var(--success))' },
  { stage: 'Fraude Check', count: 99200, percentage: 99.2, color: 'hsl(var(--warning))' },
  { stage: 'Autorización', count: 97500, percentage: 97.5, color: 'hsl(var(--warning))' },
  { stage: 'Respuesta Emisor', count: 96800, percentage: 96.8, color: 'hsl(var(--danger))' },
  { stage: 'Confirmación', count: 96500, percentage: 96.5, color: 'hsl(var(--success))' },
];

const latencyData = [
  { stage: 'Gateway de Pago', latency: 45, threshold: 100 },
  { stage: 'Validación Fraude', latency: 280, threshold: 300 },
  { stage: 'Autorización Red', latency: 150, threshold: 200 },
  { stage: 'Respuesta Emisor', latency: 320, threshold: 400 },
  { stage: 'Confirmación Final', latency: 25, threshold: 50 },
];

const recentTransactions = [
  { id: 'TXN001', type: 'Débito', amount: '$125.50', status: 'Exitosa', latency: '245ms', timestamp: '14:25:30' },
  { id: 'TXN002', type: 'Crédito', amount: '$2,500.00', status: 'Fallida', latency: '1,200ms', timestamp: '14:25:28', error: 'Timeout Gateway' },
  { id: 'TXN003', type: 'Débito', amount: '$45.00', status: 'Exitosa', latency: '180ms', timestamp: '14:25:26' },
  { id: 'TXN004', type: 'Crédito', amount: '$850.75', status: 'Rechazada', latency: '95ms', timestamp: '14:25:24', error: 'Fraude Detectado' },
  { id: 'TXN005', type: 'Débito', amount: '$200.00', status: 'Exitosa', latency: '210ms', timestamp: '14:25:22' },
];

export const TransactionFlowSection = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Card className="p-4 bg-primary/10 border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground">Flujo de Transacciones</h2>
                <p className="text-sm text-muted-foreground">Análisis detallado del procesamiento de pagos</p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </Card>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funnel de Conversión */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Embudo de Conversión</h3>
            <div className="space-y-3">
              {funnelData.map((item, index) => (
                <div key={item.stage} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-card-foreground">{item.stage}</span>
                    <span className="text-sm text-muted-foreground">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 relative">
                    <div 
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                    <span className="absolute right-2 top-0 text-xs text-white font-medium">
                      {item.percentage}%
                    </span>
                  </div>
                  {index < funnelData.length - 1 && (
                    <div className="text-xs text-danger mt-1">
                      Pérdida: {(funnelData[index].count - funnelData[index + 1].count).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Latencia por Etapa */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Latencia por Etapa (p95)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [`${value}ms`, name === 'latency' ? 'Latencia Actual' : 'Umbral']}
                  />
                  <Bar dataKey="latency" name="latency">
                    {latencyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.latency > entry.threshold ? 'hsl(var(--danger))' : 'hsl(var(--success))'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Tabla de Transacciones Recientes */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">Transacciones Recientes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Timestamp</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">ID Transacción</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Monto</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Latencia</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-3 text-sm text-card-foreground">{tx.timestamp}</td>
                      <td className="py-2 px-3 text-sm font-mono text-primary cursor-pointer hover:underline">{tx.id}</td>
                      <td className="py-2 px-3 text-sm text-card-foreground">{tx.type}</td>
                      <td className="py-2 px-3 text-sm text-card-foreground">{tx.amount}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={tx.status === 'Exitosa' ? 'default' : 'destructive'}
                            className={
                              tx.status === 'Exitosa' 
                                ? 'bg-success text-success-foreground' 
                                : tx.status === 'Fallida'
                                ? 'bg-danger text-danger-foreground'
                                : 'bg-warning text-warning-foreground'
                            }
                          >
                            {tx.status}
                          </Badge>
                          {tx.error && (
                            <div className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-danger" />
                              <span className="text-xs text-danger">{tx.error}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={`py-2 px-3 text-sm ${parseInt(tx.latency) > 500 ? 'text-danger' : 'text-success'}`}>
                        {tx.latency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};