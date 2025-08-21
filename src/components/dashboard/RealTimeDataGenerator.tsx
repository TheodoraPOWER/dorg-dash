import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const RealTimeDataGenerator = () => {
  useEffect(() => {
    const generateRealtimeData = async () => {
      try {
        // Generate new transactions every 30 seconds for Bank of America scale
        const generateTransactions = async () => {
          const processors = ['Fiserv', 'FIS', 'Stripe', 'Adyen'];
          const regions = ['NA', 'EMEA', 'LATAM'];
          const batchSize = 50; // 50 transactions every 30s = ~6,000/hour = ~144,000/day

          const transactions = [];
          const now = new Date();

          for (let i = 0; i < batchSize; i++) {
            const isSuccess = Math.random() > 0.0002; // 99.98% success rate
            const processor = processors[Math.floor(Math.random() * processors.length)];
            const region = regions[Math.floor(Math.random() * regions.length)];
            const transactionType = Math.random() > 0.6 ? 'credit' : 'debit';
            
            // Bank of America typical amounts
            const amount = transactionType === 'credit' 
              ? Math.random() * 10000 + 100  // Credit: $100-$10,100
              : Math.random() * 2000 + 50;   // Debit: $50-$2,050
            
            const latency = isSuccess 
              ? Math.floor(Math.random() * 300 + 200) // 200-500ms for success
              : Math.floor(Math.random() * 5000 + 1000); // 1-6s for failures
            
            const fraudScore = Math.random() * 100;
            const fraudStatus = fraudScore > 85 ? 'blocked' : fraudScore > 70 ? 'flagged' : 'clean';
            
            transactions.push({
              transaction_id: `TXN_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
              amount: amount.toFixed(2),
              transaction_type: transactionType,
              status: isSuccess ? 'success' : 'failed',
              error_type: isSuccess ? null : ['timeout', 'network_error', 'invalid_card', 'insufficient_funds'][Math.floor(Math.random() * 4)],
              error_code: isSuccess ? null : ['E001', 'E002', 'E003', 'E004'][Math.floor(Math.random() * 4)],
              processor: processor,
              region: region,
              latency_ms: latency,
              fraud_score: fraudScore.toFixed(2),
              fraud_status: fraudStatus,
              created_at: new Date(now.getTime() - Math.random() * 30000).toISOString(), // Last 30 seconds
              processed_at: new Date(now.getTime() - Math.random() * 30000 + latency).toISOString()
            });
          }

          const { error } = await supabase.from('transactions').insert(transactions);
          if (error) {
            console.error('Error inserting transactions:', error);
          } else {
            console.log(`Generated ${batchSize} Bank of America transactions`);
          }
        };

        // Generate system uptime updates
        const updateSystemUptime = async () => {
          const services = [
            'Card Authorization Service',
            'Payment Gateway', 
            'Fraud Detection Engine',
            'Core Banking System',
            'ATM Network',
            'Mobile Banking API',
            'Wire Transfer System'
          ];

          const uptimeUpdates = services.map(service => ({
            service_name: service,
            status: Math.random() > 0.001 ? 'up' : 'degraded', // 99.9% uptime
            availability_percentage: (99.5 + Math.random() * 0.5).toFixed(4),
            downtime_minutes: Math.floor(Math.random() * 5),
            region: ['NA', 'EMEA', 'LATAM'][Math.floor(Math.random() * 3)],
            recorded_at: new Date().toISOString()
          }));

          const { error } = await supabase.from('system_uptime').insert(uptimeUpdates);
          if (error) {
            console.error('Error updating system uptime:', error);
          }
        };

        // Generate occasional security alerts
        const generateSecurityAlerts = async () => {
          if (Math.random() > 0.9) { // 10% chance every interval
            const alertTypes = ['Failed Login Attempts', 'Suspicious Transaction Pattern', 'Malware Detection'];
            const severities = ['critical', 'high', 'medium', 'low'];
            
            const alert = {
              alert_type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
              severity: severities[Math.floor(Math.random() * severities.length)],
              description: `Bank of America security alert detected at ${new Date().toISOString()}`,
              affected_systems: [`System_${Math.floor(Math.random() * 5)}`],
              source_ip: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
              status: 'open',
              created_at: new Date().toISOString()
            };

            const { error } = await supabase.from('security_alerts').insert([alert]);
            if (error) {
              console.error('Error inserting security alert:', error);
            }
          }
        };

        // Run data generation
        await generateTransactions();
        await updateSystemUptime(); 
        await generateSecurityAlerts();

      } catch (error) {
        console.error('Error in real-time data generation:', error);
      }
    };

    // Initial data generation
    generateRealtimeData();

    // Set up intervals for continuous data generation
    const transactionInterval = setInterval(generateRealtimeData, 30000); // Every 30 seconds
    const cleanupInterval = setInterval(async () => {
      // Clean up old data to prevent database bloat
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      await supabase
        .from('transactions')
        .delete()
        .lt('created_at', threeDaysAgo.toISOString());
        
      await supabase
        .from('system_uptime')
        .delete()
        .lt('recorded_at', threeDaysAgo.toISOString());
    }, 3600000); // Every hour

    return () => {
      clearInterval(transactionInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  return null; // This component doesn't render anything
};