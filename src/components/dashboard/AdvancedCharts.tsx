import { Card } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Mock data for advanced visualizations
const fraudHeatmapData = [
  { hour: '00', Mon: 2, Tue: 1, Wed: 3, Thu: 2, Fri: 8, Sat: 12, Sun: 5 },
  { hour: '01', Mon: 1, Tue: 0, Wed: 2, Thu: 1, Fri: 5, Sat: 8, Sun: 3 },
  { hour: '02', Mon: 0, Tue: 1, Wed: 1, Thu: 0, Fri: 3, Sat: 6, Sun: 2 },
  { hour: '03', Mon: 1, Tue: 0, Wed: 0, Thu: 1, Fri: 2, Sat: 4, Sun: 1 },
  { hour: '04', Mon: 0, Tue: 0, Wed: 1, Thu: 0, Fri: 1, Sat: 2, Sun: 1 },
  { hour: '05', Mon: 1, Tue: 1, Wed: 2, Thu: 1, Fri: 3, Sat: 5, Sun: 2 },
  { hour: '06', Mon: 3, Tue: 2, Wed: 4, Thu: 3, Fri: 8, Sat: 12, Sun: 6 },
  { hour: '07', Mon: 8, Tue: 6, Wed: 10, Thu: 9, Fri: 15, Sat: 18, Sun: 12 },
  { hour: '08', Mon: 15, Tue: 12, Wed: 18, Thu: 16, Fri: 25, Sat: 22, Sun: 18 },
  { hour: '09', Mon: 25, Tue: 22, Wed: 28, Thu: 26, Fri: 35, Sat: 28, Sun: 22 },
  { hour: '10', Mon: 35, Tue: 32, Wed: 38, Thu: 36, Fri: 42, Sat: 35, Sun: 28 },
  { hour: '11', Mon: 42, Tue: 38, Wed: 45, Thu: 43, Fri: 48, Sat: 38, Sun: 32 },
  { hour: '12', Mon: 48, Tue: 45, Wed: 52, Thu: 50, Fri: 55, Sat: 42, Sun: 35 },
  { hour: '13', Mon: 45, Tue: 42, Wed: 48, Thu: 46, Fri: 52, Sat: 38, Sun: 32 },
  { hour: '14', Mon: 38, Tue: 35, Wed: 42, Thu: 40, Fri: 45, Sat: 35, Sun: 28 },
  { hour: '15', Mon: 32, Tue: 28, Wed: 35, Thu: 33, Fri: 38, Sat: 32, Sun: 25 },
  { hour: '16', Mon: 28, Tue: 25, Wed: 32, Thu: 30, Fri: 35, Sat: 28, Sun: 22 },
  { hour: '17', Mon: 25, Tue: 22, Wed: 28, Thu: 26, Fri: 32, Sat: 25, Sun: 18 },
  { hour: '18', Mon: 22, Tue: 18, Wed: 25, Thu: 23, Fri: 28, Sat: 22, Sun: 15 },
  { hour: '19', Mon: 18, Tue: 15, Wed: 22, Thu: 20, Fri: 25, Sat: 18, Sun: 12 },
  { hour: '20', Mon: 15, Tue: 12, Wed: 18, Thu: 16, Fri: 22, Sat: 15, Sun: 10 },
  { hour: '21', Mon: 12, Tue: 10, Wed: 15, Thu: 13, Fri: 18, Sat: 12, Sun: 8 },
  { hour: '22', Mon: 8, Tue: 6, Wed: 12, Thu: 10, Fri: 15, Sat: 10, Sun: 6 },
  { hour: '23', Mon: 5, Tue: 3, Wed: 8, Thu: 6, Fri: 12, Sat: 8, Sun: 4 },
];

const vendorRiskData = [
  { name: 'Fiserv', value: 82, color: 'hsl(var(--danger))' },
  { name: 'FIS', value: 45, color: 'hsl(var(--warning))' },
  { name: 'Stripe', value: 28, color: 'hsl(var(--success))' },
  { name: 'Adyen', value: 35, color: 'hsl(var(--warning))' },
  { name: 'Others', value: 15, color: 'hsl(var(--muted))' },
];

const incidentsByCauseData = [
  { cause: 'Hardware Failure', count: 5, fill: 'hsl(var(--danger))' },
  { cause: 'Software Bug', count: 12, fill: 'hsl(var(--warning))' },
  { cause: 'Human Error', count: 3, fill: 'hsl(var(--primary))' },
  { cause: 'Third Party Issue', count: 8, fill: 'hsl(var(--accent))' },
  { cause: 'Capacity', count: 4, fill: 'hsl(var(--muted))' },
];

interface GaugeProps {
  value: number;
  max: number;
  thresholds: { low: number; medium: number; high: number };
  title: string;
  unit?: string;
}

const Gauge = ({ value, max, thresholds, title, unit = '' }: GaugeProps) => {
  const percentage = (value / max) * 100;
  let color = 'hsl(var(--success))';
  
  if (value > thresholds.high) color = 'hsl(var(--danger))';
  else if (value > thresholds.medium) color = 'hsl(var(--warning))';

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-16 mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 50">
          <path
            d="M 10 40 A 40 40 0 0 1 90 40"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M 10 40 A 40 40 0 0 1 90 40"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${percentage * 1.26} 126`}
            fill="none"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {value}{unit}
          </span>
        </div>
      </div>
      <h4 className="text-sm font-medium text-center text-card-foreground">{title}</h4>
    </div>
  );
};

export const FraudHeatmap = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxValue = Math.max(...fraudHeatmapData.flatMap(hour => days.map(day => hour[day as keyof typeof hour] as number)));

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm col-span-full">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Fraud Attempts Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-8 gap-1 text-xs">
            <div></div>
            {days.map(day => (
              <div key={day} className="text-center font-medium text-muted-foreground p-1">
                {day}
              </div>
            ))}
          </div>
          {fraudHeatmapData.map((hourData) => (
            <div key={hourData.hour} className="grid grid-cols-8 gap-1 text-xs">
              <div className="text-right font-medium text-muted-foreground p-1">
                {hourData.hour}:00
              </div>
              {days.map(day => {
                const value = hourData[day as keyof typeof hourData] as number;
                const intensity = value / maxValue;
                return (
                  <div
                    key={`${hourData.hour}-${day}`}
                    className="p-1 text-center rounded text-white font-medium"
                    style={{
                      backgroundColor: `hsl(0, 84%, ${Math.max(40 - intensity * 20, 20)}%)`,
                      opacity: 0.3 + intensity * 0.7
                    }}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export const VendorRiskPie = () => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Vendor Concentration Risk</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={vendorRiskData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({name, value}) => `${name}: ${value}%`}
            >
              {vendorRiskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, 'Concentration']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const IncidentsByCause = () => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Incidents by Root Cause</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={incidentsByCauseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="cause" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {incidentsByCauseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const GaugeSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <Gauge 
          value={3} 
          max={20} 
          thresholds={{ low: 5, medium: 10, high: 15 }}
          title="Critical Vulnerabilities"
        />
      </Card>
      
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <Gauge 
          value={9} 
          max={15} 
          thresholds={{ low: 5, medium: 10, high: 12 }}
          title="Phishing Rate"
          unit="%"
        />
      </Card>
      
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <Gauge 
          value={96} 
          max={100} 
          thresholds={{ low: 80, medium: 90, high: 95 }}
          title="Training Completion"
          unit="%"
        />
      </Card>
    </div>
  );
};