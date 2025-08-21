import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Bank of America scale: ~15M transactions per day
    const processors = ['Fiserv', 'FIS', 'Stripe', 'Adyen', 'First Data']
    const regions = ['NA', 'EMEA', 'LATAM', 'APAC']
    
    // Generate realistic transaction data
    const generateTransactions = (count: number) => {
      const transactions = []
      const now = new Date()
      
      for (let i = 0; i < count; i++) {
        const isSuccess = Math.random() > 0.0002 // 99.98% success rate
        const processor = processors[Math.floor(Math.random() * processors.length)]
        const region = regions[Math.floor(Math.random() * regions.length)]
        const transactionType = Math.random() > 0.6 ? 'credit' : 'debit'
        
        // Generate amounts typical for Bank of America
        const amount = transactionType === 'credit' 
          ? Math.random() * 10000 + 100  // Credit: $100-$10,100
          : Math.random() * 2000 + 50    // Debit: $50-$2,050
        
        const latency = isSuccess 
          ? Math.floor(Math.random() * 300 + 200) // 200-500ms for success
          : Math.floor(Math.random() * 5000 + 1000) // 1-6s for failures
        
        const fraudScore = Math.random() * 100
        const fraudStatus = fraudScore > 85 ? 'blocked' : fraudScore > 70 ? 'flagged' : 'clean'
        
        transactions.push({
          transaction_id: `TXN_${Date.now()}_${i}`,
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
          created_at: new Date(now.getTime() - Math.random() * 3600000).toISOString(), // Last hour
          processed_at: new Date(now.getTime() - Math.random() * 3600000 + latency).toISOString()
        })
      }
      return transactions
    }

    // Generate system uptime data
    const generateSystemUptime = () => {
      const services = [
        'Card Authorization Service',
        'Payment Gateway',
        'Fraud Detection Engine',
        'Core Banking System',
        'ATM Network',
        'Mobile Banking API',
        'Wire Transfer System'
      ]
      
      return services.map(service => ({
        service_name: service,
        status: Math.random() > 0.001 ? 'up' : 'degraded', // 99.9% uptime
        availability_percentage: (99.5 + Math.random() * 0.5).toFixed(4),
        downtime_minutes: Math.floor(Math.random() * 30),
        region: regions[Math.floor(Math.random() * regions.length)],
        recorded_at: new Date().toISOString()
      }))
    }

    // Generate incident data
    const generateIncidents = () => {
      const incidents = []
      const severities = ['critical', 'major', 'minor', 'info']
      const categories = ['network', 'application', 'database', 'security', 'hardware']
      
      // Generate some open incidents
      for (let i = 0; i < 5; i++) {
        const severity = severities[Math.floor(Math.random() * severities.length)]
        const isResolved = Math.random() > 0.3
        
        incidents.push({
          incident_id: `INC_${Date.now()}_${i}`,
          title: `${severity.toUpperCase()}: Service disruption in ${categories[Math.floor(Math.random() * categories.length)]}`,
          severity: severity,
          status: isResolved ? 'resolved' : ['open', 'investigating'][Math.floor(Math.random() * 2)],
          category: categories[Math.floor(Math.random() * categories.length)],
          root_cause: isResolved ? 'Network configuration error' : null,
          affected_services: [`Service_${Math.floor(Math.random() * 10)}`],
          created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Last 24h
          resolved_at: isResolved ? new Date().toISOString() : null,
          mttr_minutes: isResolved ? Math.floor(Math.random() * 300 + 60) : null
        })
      }
      return incidents
    }

    // Generate security alerts
    const generateSecurityAlerts = () => {
      const alertTypes = ['Failed Login Attempts', 'Suspicious Transaction Pattern', 'Malware Detection', 'Privilege Escalation']
      const severities = ['critical', 'high', 'medium', 'low']
      
      return Array.from({length: 10}, (_, i) => ({
        alert_type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: `Security alert detected at ${new Date().toISOString()}`,
        affected_systems: [`System_${Math.floor(Math.random() * 5)}`],
        source_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        status: Math.random() > 0.7 ? 'resolved' : 'open',
        created_at: new Date(Date.now() - Math.random() * 3600000).toISOString()
      }))
    }

    // Generate vulnerability data
    const generateVulnerabilities = () => {
      const severities = ['critical', 'high', 'medium', 'low']
      const assets = ['Web Server', 'Database Server', 'API Gateway', 'Load Balancer', 'Firewall']
      
      return Array.from({length: 15}, (_, i) => ({
        vulnerability_id: `CVE-2025-${1000 + i}`,
        title: `Security vulnerability in ${assets[Math.floor(Math.random() * assets.length)]}`,
        severity: severities[Math.floor(Math.random() * severities.length)],
        cvss_score: (Math.random() * 10).toFixed(1),
        affected_asset: assets[Math.floor(Math.random() * assets.length)],
        status: ['open', 'patching', 'resolved'][Math.floor(Math.random() * 3)],
        discovered_date: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString().split('T')[0]
      }))
    }

    // Insert data in batches
    const batchSize = 1000
    const transactionBatches = Math.ceil(5000 / batchSize) // Generate 5000 transactions per call
    
    for (let i = 0; i < transactionBatches; i++) {
      const transactions = generateTransactions(Math.min(batchSize, 5000 - i * batchSize))
      await supabaseClient.from('transactions').insert(transactions)
    }

    await supabaseClient.from('system_uptime').insert(generateSystemUptime())
    await supabaseClient.from('incidents').insert(generateIncidents())
    await supabaseClient.from('security_alerts').insert(generateSecurityAlerts())
    await supabaseClient.from('vulnerabilities').insert(generateVulnerabilities())

    // Generate vendor data
    const vendorData = [
      {
        vendor_name: 'Fiserv',
        service_type: 'Payment Processing',
        sla_percentage: 99.95,
        current_availability: 99.87,
        risk_rating: 'low',
        contract_value: 125000000,
        transaction_volume_percentage: 35.2,
        last_audit_date: '2025-06-15',
        next_audit_date: '2026-06-15',
        region: 'NA'
      },
      {
        vendor_name: 'FIS',
        service_type: 'Core Banking',
        sla_percentage: 99.99,
        current_availability: 99.98,
        risk_rating: 'low',
        contract_value: 200000000,
        transaction_volume_percentage: 28.7,
        last_audit_date: '2025-05-20',
        next_audit_date: '2026-05-20',
        region: 'NA'
      },
      {
        vendor_name: 'Stripe',
        service_type: 'Online Payments',
        sla_percentage: 99.90,
        current_availability: 99.85,
        risk_rating: 'medium',
        contract_value: 45000000,
        transaction_volume_percentage: 18.3,
        last_audit_date: '2025-07-10',
        next_audit_date: '2026-07-10',
        region: 'NA'
      }
    ]

    await supabaseClient.from('vendors').insert(vendorData)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Bank of America scale data generated successfully',
        data: {
          transactions: 5000,
          uptime_records: 7,
          incidents: 5,
          security_alerts: 10,
          vulnerabilities: 15,
          vendors: 3
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})