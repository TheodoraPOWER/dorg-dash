import { useState, useEffect } from 'react';

export interface DashboardMetrics {
  systemAvailability: number;
  errorRate: number;
  fraudAmount: number;
  openIncidents: number;
  transactionVolume: number;
  criticalVulnerabilities: number;
  vendorSlaCompliance: number;
  phishingClickRate: number;
  trainingCompletion: number;
}

export interface TransactionData {
  time: string;
  success: number;
  failed: number;
  latency: number;
}

export interface IncidentData {
  severity: string;
  count: number;
}

export const useDashboardData = (filters: any) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    systemAvailability: 0,
    errorRate: 0,
    fraudAmount: 0,
    openIncidents: 0,
    transactionVolume: 0,
    criticalVulnerabilities: 0,
    vendorSlaCompliance: 0,
    phishingClickRate: 0,
    trainingCompletion: 0
  });

  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [incidentData, setIncidentData] = useState<IncidentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Simulate Bank of America scale data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      // Generate realistic Bank of America metrics
      const baseTransactionVolume = 2_150_000; // ~2.15M transactions per day
      const variationFactor = 0.1; // 10% variation
      const transactionVolume = Math.floor(baseTransactionVolume * (1 + (Math.random() - 0.5) * variationFactor));
      
      setMetrics({
        systemAvailability: 99.98 + Math.random() * 0.01, // Very high availability
        errorRate: 0.015 + Math.random() * 0.01, // Low error rate
        fraudAmount: Math.floor(Math.random() * 50000 + 15000), // $15K-$65K daily fraud
        openIncidents: Math.floor(Math.random() * 8 + 2), // 2-10 open incidents
        transactionVolume: transactionVolume,
        criticalVulnerabilities: Math.floor(Math.random() * 5), // 0-4 critical vulns
        vendorSlaCompliance: 98.5 + Math.random() * 1.4, // 98.5-99.9%
        phishingClickRate: 8.2 + Math.random() * 2.6, // 8.2-10.8%
        trainingCompletion: 95.5 + Math.random() * 3.5 // 95.5-99%
      });

      // Generate hourly transaction data
      const hourlyData = generateHourlyTransactionData();
      setTransactionData(hourlyData);

      // Generate incident data
      const incidentSeverityData = [
        { severity: 'Critical', count: Math.floor(Math.random() * 3) },
        { severity: 'High', count: Math.floor(Math.random() * 5 + 2) },
        { severity: 'Medium', count: Math.floor(Math.random() * 12 + 8) },
        { severity: 'Low', count: Math.floor(Math.random() * 20 + 15) },
      ];
      setIncidentData(incidentSeverityData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateHourlyTransactionData = (): TransactionData[] => {
    const data: TransactionData[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourStr = hour.getHours().toString().padStart(2, '0') + ':00';
      
      // Business hours have higher volume
      const isBusinessHours = hour.getHours() >= 8 && hour.getHours() <= 18;
      const baseVolume = isBusinessHours ? 120000 : 45000; // Transactions per hour
      const volume = Math.floor(baseVolume * (0.8 + Math.random() * 0.4));
      
      const successRate = 0.9985 + Math.random() * 0.001; // 99.85-99.95% success
      const successCount = Math.floor(volume * successRate);
      const failedCount = volume - successCount;
      
      data.push({
        time: hourStr,
        success: successCount,
        failed: failedCount,
        latency: 180 + Math.random() * 120 // 180-300ms average latency
      });
    }
    
    return data;
  };

  const processTransactionsByHour = (transactions: any[]): TransactionData[] => {
    const hourlyMap = new Map();
    
    transactions.forEach(t => {
      const hour = new Date(t.created_at).getHours();
      const key = `${hour}:00`;
      
      if (!hourlyMap.has(key)) {
        hourlyMap.set(key, { time: key, success: 0, failed: 0, latencies: [] });
      }
      
      const data = hourlyMap.get(key);
      if (t.status === 'success') {
        data.success++;
      } else {
        data.failed++;
      }
      data.latencies.push(t.latency_ms);
    });

    return Array.from(hourlyMap.values()).map(d => ({
      ...d,
      latency: d.latencies.reduce((sum: number, l: number) => sum + l, 0) / (d.latencies.length || 1)
    })).sort((a, b) => a.time.localeCompare(b.time));
  };

  const processIncidentsBySeverity = (incidents: any[]): IncidentData[] => {
    const severityMap = new Map();
    
    incidents.forEach(i => {
      const severity = i.severity;
      severityMap.set(severity, (severityMap.get(severity) || 0) + 1);
    });

    return Array.from(severityMap.entries()).map(([severity, count]) => ({
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      count
    }));
  };

  // Initialize data on mount
  useEffect(() => {
    fetchMetrics();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchMetrics();
  }, [filters]);

  // Set up real-time data updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, [filters]);

  return {
    metrics,
    transactionData,
    incidentData,
    loading,
    error,
    refetch: fetchMetrics
  };
};