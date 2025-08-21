import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, RefreshCw } from 'lucide-react';

interface GlobalFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
}

interface FilterState {
  timeRange: string;
  transactionType: string;
  vendor: string;
  region: string;
}

export const GlobalFilters = ({ onFiltersChange }: GlobalFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    timeRange: '24h',
    transactionType: 'all',
    vendor: 'all',
    region: 'all'
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'credit', label: 'Credit' },
    { value: 'debit', label: 'Debit' },
  ];

  const vendors = [
    { value: 'all', label: 'All Vendors' },
    { value: 'Fiserv', label: 'Fiserv' },
    { value: 'FIS', label: 'FIS' },
    { value: 'Stripe', label: 'Stripe' },
    { value: 'Adyen', label: 'Adyen' },
  ];

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'NA', label: 'North America' },
    { value: 'EMEA', label: 'EMEA' },
    { value: 'LATAM', label: 'LATAM' },
  ];

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-card-foreground">Global Filters:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={filters.timeRange} onValueChange={(value) => handleFilterChange('timeRange', value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={filters.transactionType} onValueChange={(value) => handleFilterChange('transactionType', value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {transactionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.vendor} onValueChange={(value) => handleFilterChange('vendor', value)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.value} value={vendor.value}>
                {vendor.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="ml-auto">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    </Card>
  );
};