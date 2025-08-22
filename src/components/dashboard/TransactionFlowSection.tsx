import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const funnelData = [
  { stage: 'Start', count: 100000, percentage: 100, color: 'hsl(var(--success))' },
  { stage: 'Gateway', count: 99850, percentage: 99.85, color: 'hsl(var(--success))' },
  { stage: 'Fraud Check', count: 99200, percentage: 99.2, color: 'hsl(var(--warning))' },
  { stage: 'Authorization', count: 97500, percentage: 97.5, color: 'hsl(var(--warning))' },
  { stage: 'Issuer Response', count: 96800, percentage: 96.8, color: 'hsl(var(--danger))' },
  { stage: 'Confirmation', count: 96500, percentage: 96.5, color: 'hsl(var(--success))' },
];

const latencyData = [
  { stage: 'Payment Gateway', latency: 45, threshold: 100 },
  { stage: 'Fraud Validation', latency: 280, threshold: 300 },
  { stage: 'Network Authorization', latency: 150, threshold: 200 },
  { stage: 'Issuer Response', latency: 320, threshold: 400 },
  { stage: 'Final Confirmation', latency: 25, threshold: 50 },
];

const recentTransactions = [
  { id: 'TXN001', type: 'Debit', amount: '$125.50', status: 'Success', latency: '245ms', timestamp: '14:25:30' },
  { id: 'TXN002', type: 'Credit', amount: '$2,500.00', status: 'Failed', latency: '1,200ms', timestamp: '14:25:28', error: 'Gateway Timeout' },
  { id: 'TXN003', type: 'Debit', amount: '$45.00', status: 'Success', latency: '180ms', timestamp: '14:25:26' },
  { id: 'TXN004', type: 'Credit', amount: '$850.75', status: 'Rejected', latency: '95ms', timestamp: '14:25:24', error: 'Fraud Detected' },
  { id: 'TXN005', type: 'Debit', amount: '$200.00', status: 'Success', latency: '210ms', timestamp: '14:25:22' },
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
                <h2 className="text-xl font-bold text-card-foreground">Transaction Flow</h2>
                <p className="text-sm text-muted-foreground">Detailed payment processing analysis</p>
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
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Conversion Funnel</h3>
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
                      Lost: {(funnelData[index].count - funnelData[index + 1].count).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Latencia por Etapa */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Latency per Stage (p95)</h3>
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
                    formatter={(value, name) => [`${value}ms`, name === 'latency' ? 'Current Latency' : 'Threshold']}
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
              <h3 className="text-lg font-semibold text-card-foreground">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Timestamp</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Transaction ID</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Latency</th>
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
                            variant={tx.status === 'Success' ? 'default' : 'destructive'}
                            className={
                              tx.status === 'Success' 
                                ? 'bg-success text-success-foreground' 
                                : tx.status === 'Failed'
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