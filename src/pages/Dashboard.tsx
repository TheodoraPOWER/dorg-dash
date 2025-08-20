import { 
  Shield, 
  AlertTriangle, 
  TestTube, 
  Users, 
  Share2,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Database,
  Server
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PillarSection } from '@/components/dashboard/PillarSection';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const uptimeData = [
  { name: 'Jan', uptime: 99.95 },
  { name: 'Feb', uptime: 99.87 },
  { name: 'Mar', uptime: 99.98 },
  { name: 'Apr', uptime: 99.92 },
  { name: 'May', uptime: 99.85 },
  { name: 'Jun', uptime: 99.99 },
];

const errorRateData = [
  { name: 'Semana 1', errors: 0.02 },
  { name: 'Semana 2', errors: 0.05 },
  { name: 'Semana 3', errors: 0.01 },
  { name: 'Semana 4', errors: 0.03 },
];

const incidentData = [
  { name: 'Crítico', count: 2 },
  { name: 'Mayor', count: 8 },
  { name: 'Menor', count: 24 },
  { name: 'Info', count: 67 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">DORA Dashboard</h1>
            <p className="text-muted-foreground">Digital Operational Resilience Act - Risk Metrics</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Última actualización</p>
            <p className="text-sm font-medium">19 Ago 2025, 14:30</p>
          </div>
        </div>

        {/* Pilar 1: Gestión de Riesgos de TIC */}
        <PillarSection
          title="Pilar 1: Gestión de Riesgos de TIC"
          subtitle="ICT Risk Management"
          icon={<Shield className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="Tiempo de Actividad"
            value="99.98%"
            subtitle="↑ 0.03% vs mes anterior"
            icon={<Activity />}
            status="success"
            trend="up"
          />
          <MetricCard
            title="Tasa de Error en Transacciones"
            value="0.02%"
            subtitle="↓ 0.01% vs semana anterior"
            icon={<TrendingDown />}
            status="success"
            trend="down"
          />
          <MetricCard
            title="Alertas de Seguridad"
            value="14"
            subtitle="3 críticas, 11 menores"
            icon={<AlertTriangle />}
            status="warning"
          />
          <MetricCard
            title="Precisión de Datos"
            value="99.94%"
            subtitle="Validación ETL exitosa"
            icon={<Database />}
            status="success"
          />
          <ChartCard
            title="Disponibilidad del Sistema (6 meses)"
            subtitle="Tiempo de actividad promedio por mes"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={uptimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="uptime" 
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success))" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Tasa de Error Semanal"
            subtitle="Porcentaje de transacciones fallidas"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  stroke="hsl(var(--danger))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </PillarSection>

        {/* Pilar 2: Notificación de Incidentes */}
        <PillarSection
          title="Pilar 2: Notificación de Incidentes"
          subtitle="ICT-Related Incident Reporting"
          icon={<AlertCircle className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="Incidentes Activos"
            value="12"
            subtitle="2 críticos, 4 mayores"
            icon={<XCircle />}
            status="danger"
          />
          <MetricCard
            title="MTTR Promedio"
            value="2.3h"
            subtitle="↓ 15min vs objetivo 4h"
            icon={<Clock />}
            status="success"
            trend="down"
          />
          <MetricCard
            title="Incidentes resueltos (7d)"
            value="28"
            subtitle="96% dentro de SLA"
            icon={<CheckCircle />}
            status="success"
          />
          <MetricCard
            title="RCA Completados"
            value="85%"
            subtitle="17 de 20 incidentes mayores"
            icon={<TestTube />}
            status="warning"
          />
          <ChartCard
            title="Incidentes por Severidad (Mes actual)"
            subtitle="Distribución de incidentes reportados"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </PillarSection>

        {/* Pilar 3: Pruebas de Resiliencia */}
        <PillarSection
          title="Pilar 3: Pruebas de Resiliencia"
          subtitle="Digital Operational Resilience Testing"
          icon={<TestTube className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="Vulnerabilidades Críticas"
            value="3"
            subtitle="↓ 2 desde último escaneo"
            icon={<AlertTriangle />}
            status="warning"
            trend="down"
          />
          <MetricCard
            title="Pentesting Score"
            value="87/100"
            subtitle="Última evaluación Q3 2025"
            icon={<Shield />}
            status="success"
          />
          <MetricCard
            title="RTO Último DR Test"
            value="3h 45m"
            subtitle="Objetivo: 4h ✓"
            icon={<Server />}
            status="success"
          />
          <MetricCard
            title="BCP Test Coverage"
            value="94%"
            subtitle="15 de 16 sistemas críticos"
            icon={<CheckCircle />}
            status="success"
          />
        </PillarSection>

        {/* Pilar 4: Gestión de Riesgos de Terceros */}
        <PillarSection
          title="Pilar 4: Gestión de Riesgos de Terceros"
          subtitle="ICT Third-Party Risk Management"
          icon={<Users className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="Proveedores Críticos"
            value="23"
            subtitle="8 con SLA > 99.9%"
            icon={<Users />}
            status="neutral"
          />
          <MetricCard
            title="SLA Compliance"
            value="98.2%"
            subtitle="1 proveedor fuera de SLA"
            icon={<TrendingUp />}
            status="warning"
          />
          <MetricCard
            title="Auditorías Pendientes"
            value="4"
            subtitle="2 SOC2, 2 ISO27001"
            icon={<AlertCircle />}
            status="warning"
          />
          <MetricCard
            title="Riesgo de Concentración"
            value="82%"
            subtitle="ABC Corp - Transacciones"
            icon={<AlertTriangle />}
            status="danger"
          />
        </PillarSection>

        {/* Pilar 5: Intercambio de Información */}
        <PillarSection
          title="Pilar 5: Intercambio de Información"
          subtitle="Information Sharing"
          icon={<Share2 className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="Training Completion"
            value="96%"
            subtitle="Curso Seguridad Q3 2025"
            icon={<CheckCircle />}
            status="success"
          />
          <MetricCard
            title="Phishing Test Rate"
            value="9%"
            subtitle="↓ 3% vs trimestre anterior"
            icon={<TrendingDown />}
            status="success"
            trend="down"
          />
          <MetricCard
            title="Threat Intel Feeds"
            value="5"
            subtitle="FS-ISAC, CISA, vendor feeds"
            icon={<Share2 />}
            status="neutral"
          />
          <MetricCard
            title="IOCs Procesados (7d)"
            value="247"
            subtitle="12 matched, 0 críticos"
            icon={<Activity />}
            status="success"
          />
        </PillarSection>
      </div>
    </div>
  );
};

export default Dashboard;