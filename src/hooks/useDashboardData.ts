import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

      // Calculate time range based on filters
      const now = new Date();
      let timeFilter = new Date();
      
      switch (filters.timeRange) {
        case '1h':
          timeFilter.setHours(now.getHours() - 1);
          break;
        case '24h':
          timeFilter.setDate(now.getDate() - 1);
          break;
        case '7d':
          timeFilter.setDate(now.getDate() - 7);
          break;
        case '30d':
          timeFilter.setDate(now.getDate() - 30);
          break;
        default:
          timeFilter.setDate(now.getDate() - 1);
      }

      // Fetch transaction metrics
      let transactionQuery = supabase
        .from('transactions')
        .select('*')
        .gte('created_at', timeFilter.toISOString());

      if (filters.transactionType !== 'all') {
        transactionQuery = transactionQuery.eq('transaction_type', filters.transactionType);
      }

      if (filters.vendor !== 'all') {
        transactionQuery = transactionQuery.eq('processor', filters.vendor);
      }

      if (filters.region !== 'all') {
        transactionQuery = transactionQuery.eq('region', filters.region);
      }

      const { data: transactions, error: txError } = await transactionQuery;
      
      if (txError) throw txError;

      // Fetch system uptime
      const { data: uptime, error: uptimeError } = await supabase
        .from('system_uptime')
        .select('availability_percentage')
        .gte('recorded_at', timeFilter.toISOString());

      if (uptimeError) throw uptimeError;

      // Fetch incidents
      const { data: incidents, error: incidentError } = await supabase
        .from('incidents')
        .select('*')
        .eq('status', 'open');

      if (incidentError) throw incidentError;

      // Fetch vulnerabilities
      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('vulnerabilities')
        .select('*')
        .eq('severity', 'critical')
        .eq('status', 'open');

      if (vulnError) throw vulnError;

      // Fetch vendor SLA data
      const { data: vendors, error: vendorError } = await supabase
        .from('vendors')
        .select('sla_percentage, current_availability');

      if (vendorError) throw vendorError;

      // Calculate metrics
      const totalTransactions = transactions?.length || 0;
      const failedTransactions = transactions?.filter(t => t.status === 'failed').length || 0;
      const fraudTransactions = transactions?.filter(t => t.fraud_status === 'blocked') || [];
      const fraudAmount = fraudTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const avgAvailability = uptime?.reduce((sum, u) => sum + u.availability_percentage, 0) / (uptime?.length || 1);
      const errorRate = totalTransactions > 0 ? (failedTransactions / totalTransactions) * 100 : 0;

      const criticalIncidents = incidents?.filter(i => i.severity === 'critical').length || 0;
      const majorIncidents = incidents?.filter(i => i.severity === 'major').length || 0;

      const avgSlaCompliance = vendors?.reduce((sum, v) => sum + v.current_availability, 0) / (vendors?.length || 1);

      setMetrics({
        systemAvailability: avgAvailability,
        errorRate: errorRate,
        fraudAmount: fraudAmount,
        openIncidents: criticalIncidents + majorIncidents,
        transactionVolume: totalTransactions,
        criticalVulnerabilities: vulnerabilities?.length || 0,
        vendorSlaCompliance: avgSlaCompliance,
        phishingClickRate: 9.2, // Mock data
        trainingCompletion: 96.4 // Mock data
      });

      // Process transaction data for charts
      const hourlyData = processTransactionsByHour(transactions || []);
      setTransactionData(hourlyData);

      // Process incident data
      const incidentSeverityData = processIncidentsBySeverity(incidents || []);
      setIncidentData(incidentSeverityData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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

  // Initialize data generation on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Generate initial data
        const response = await supabase.functions.invoke('generate-bank-data');
        if (!response.error) {
          await fetchMetrics();
        }
      } catch (err) {
        console.error('Failed to initialize data:', err);
        // Fetch existing data even if generation fails
        await fetchMetrics();
      }
    };

    initializeData();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchMetrics();
  }, [filters]);

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' },
        () => fetchMetrics()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        () => fetchMetrics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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