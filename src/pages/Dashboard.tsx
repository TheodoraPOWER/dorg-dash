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
import { GlobalFilters } from '@/components/dashboard/GlobalFilters';
import { KPIHeader } from '@/components/dashboard/KPIHeader';
import { TransactionFlowSection } from '@/components/dashboard/TransactionFlowSection';
import { FraudHeatmap, VendorRiskPie, IncidentsByCause, GaugeSection } from '@/components/dashboard/AdvancedCharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { RealTimeDataGenerator } from '@/components/dashboard/RealTimeDataGenerator';
import { useState } from 'react';

// Bank of America scale mock data
const uptimeData = [
  { name: 'Jan', uptime: 99.95 },
  { name: 'Feb', uptime: 99.87 },
  { name: 'Mar', uptime: 99.98 },
  { name: 'Apr', uptime: 99.92 },
  { name: 'May', uptime: 99.85 },
  { name: 'Jun', uptime: 99.99 },
];

const errorRateData = [
  { name: 'Week 1', errors: 0.02 },
  { name: 'Week 2', errors: 0.05 },
  { name: 'Week 3', errors: 0.01 },
  { name: 'Week 4', errors: 0.03 },
];

const incidentData = [
  { name: 'Critical', count: 2 },
  { name: 'Major', count: 8 },
  { name: 'Minor', count: 24 },
  { name: 'Info', count: 67 },
];

const Dashboard = () => {
  const [filters, setFilters] = useState({
    timeRange: '24h',
    transactionType: 'all',
    vendor: 'all',
    region: 'all'
  });

  const { metrics, transactionData, incidentData: realIncidentData, loading, error } = useDashboardData(filters);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading Bank of America operational data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">Error loading data: {error}</p>
            <p className="text-muted-foreground">Using sample data for demonstration</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <RealTimeDataGenerator />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bank of America - Operational Resilience Dashboard</h1>
            <p className="text-muted-foreground">DORA Compliance - Real-time Transaction & Risk Monitoring</p>
            <p className="text-xs text-muted-foreground mt-1">
              Processing {metrics.transactionVolume.toLocaleString()} transactions • 
              {metrics.systemAvailability.toFixed(2)}% system availability
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Global Filters */}
        <GlobalFilters onFiltersChange={handleFiltersChange} />

        {/* KPI Header */}
        <KPIHeader />

        {/* Transaction Flow Section */}
        <TransactionFlowSection />

        {/* Pillar 1: ICT Risk Management */}
        <PillarSection
          title="Pillar 1: ICT Risk Management"
          subtitle="Technology Infrastructure & Risk Controls"
          icon={<Shield className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="System Uptime"
            value={`${metrics.systemAvailability.toFixed(2)}%`}
            subtitle="↑ 0.03% vs last month"
            icon={<Activity />}
            status={metrics.systemAvailability > 99.9 ? "success" : "warning"}
            trend="up"
          />
          <MetricCard
            title="Transaction Error Rate"
            value={`${metrics.errorRate.toFixed(3)}%`}
            subtitle="↓ 0.01% vs last week"
            icon={<TrendingDown />}
            status={metrics.errorRate < 0.1 ? "success" : "warning"}
            trend="down"
          />
          <MetricCard
            title="Security Alerts"
            value="14"
            subtitle="3 critical, 11 minor"
            icon={<AlertTriangle />}
            status="warning"
          />
          <MetricCard
            title="Data Accuracy"
            value="99.94%"
            subtitle="ETL validation successful"
            icon={<Database />}
            status="success"
          />
          <ChartCard
            title="System Availability (6 months)"
            subtitle="Average uptime percentage by month"
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
            title="Weekly Error Rate"
            subtitle="Percentage of failed transactions"
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
          <FraudHeatmap />
        </PillarSection>

        {/* Pillar 2: ICT-Related Incident Reporting */}
        <PillarSection
          title="Pillar 2: ICT-Related Incident Reporting"
          subtitle="Incident Response & Management"
          icon={<AlertCircle className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="Active Incidents"
            value={metrics.openIncidents.toString()}
            subtitle="2 critical, 4 major"
            icon={<XCircle />}
            status={metrics.openIncidents === 0 ? "success" : metrics.openIncidents < 3 ? "warning" : "danger"}
          />
          <MetricCard
            title="Average MTTR"
            value="2.3h"
            subtitle="↓ 15min vs 4h target"
            icon={<Clock />}
            status="success"
            trend="down"
          />
          <MetricCard
            title="Incidents Resolved (7d)"
            value="28"
            subtitle="96% within SLA"
            icon={<CheckCircle />}
            status="success"
          />
          <MetricCard
            title="RCA Completed"
            value="85%"
            subtitle="17 of 20 major incidents"
            icon={<TestTube />}
            status="warning"
          />
          <ChartCard
            title="Incidents by Severity (Current Month)"
            subtitle="Distribution of reported incidents"
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
          <IncidentsByCause />
        </PillarSection>

        {/* Pillar 3: Digital Operational Resilience Testing */}
        <PillarSection
          title="Pillar 3: Digital Operational Resilience Testing"
          subtitle="Security Testing & Vulnerability Management"
          icon={<TestTube className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="Critical Vulnerabilities"
            value={metrics.criticalVulnerabilities.toString()}
            subtitle="↓ 2 since last scan"
            icon={<AlertTriangle />}
            status={metrics.criticalVulnerabilities === 0 ? "success" : metrics.criticalVulnerabilities < 5 ? "warning" : "danger"}
            trend="down"
          />
          <MetricCard
            title="Pentesting Score"
            value="87/100"
            subtitle="Last assessment Q3 2025"
            icon={<Shield />}
            status="success"
          />
          <MetricCard
            title="RTO Last DR Test"
            value="3h 45m"
            subtitle="Target: 4h ✓"
            icon={<Server />}
            status="success"
          />
          <MetricCard
            title="BCP Test Coverage"
            value="94%"
            subtitle="15 of 16 critical systems"
            icon={<CheckCircle />}
            status="success"
          />
          <div className="col-span-full">
            <GaugeSection />
          </div>
        </PillarSection>

        {/* Pillar 4: ICT Third-Party Risk Management */}
        <PillarSection
          title="Pillar 4: ICT Third-Party Risk Management"
          subtitle="Vendor Risk Assessment & Monitoring"
          icon={<Users className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="Critical Vendors"
            value="23"
            subtitle="8 with SLA > 99.9%"
            icon={<Users />}
            status="neutral"
          />
          <MetricCard
            title="SLA Compliance"
            value={`${metrics.vendorSlaCompliance.toFixed(1)}%`}
            subtitle="1 vendor below SLA"
            icon={<TrendingUp />}
            status={metrics.vendorSlaCompliance > 99 ? "success" : "warning"}
          />
          <MetricCard
            title="Pending Audits"
            value="4"
            subtitle="2 SOC2, 2 ISO27001"
            icon={<AlertCircle />}
            status="warning"
          />
          <MetricCard
            title="Concentration Risk"
            value="82%"
            subtitle="Fiserv - Transactions"
            icon={<AlertTriangle />}
            status="danger"
          />
          <div className="col-span-full lg:col-span-2">
            <VendorRiskPie />
          </div>
        </PillarSection>

        {/* Pillar 5: Information Sharing */}
        <PillarSection
          title="Pillar 5: Information Sharing"
          subtitle="Threat Intelligence & Security Awareness"
          icon={<Share2 className="w-6 h-6 text-primary" />}
        >
          <MetricCard
            title="Training Completion"
            value={`${metrics.trainingCompletion.toFixed(1)}%`}
            subtitle="Security Training Q3 2025"
            icon={<CheckCircle />}
            status={metrics.trainingCompletion > 95 ? "success" : "warning"}
          />
          <MetricCard
            title="Phishing Test Rate"
            value={`${metrics.phishingClickRate.toFixed(1)}%`}
            subtitle="↓ 3% vs previous quarter"
            icon={<TrendingDown />}
            status={metrics.phishingClickRate < 10 ? "success" : "warning"}
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
            title="IOCs Processed (7d)"
            value="247"
            subtitle="12 matched, 0 critical"
            icon={<Activity />}
            status="success"
          />
        </PillarSection>
      </div>
    </div>
  );
};

export default Dashboard;