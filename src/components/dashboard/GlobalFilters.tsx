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
    { value: '1h', label: 'Última hora' },
    { value: '24h', label: 'Últimas 24 horas' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
  ];

  const transactionTypes = [
    { value: 'all', label: 'Todos' },
    { value: 'credit', label: 'Crédito' },
    { value: 'debit', label: 'Débito' },
  ];

  const vendors = [
    { value: 'all', label: 'Todos los Proveedores' },
    { value: 'fiserv', label: 'Fiserv' },
    { value: 'fis', label: 'FIS' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'adyen', label: 'Adyen' },
  ];

  const regions = [
    { value: 'all', label: 'Todas las Regiones' },
    { value: 'na', label: 'Norte América' },
    { value: 'emea', label: 'EMEA' },
    { value: 'latam', label: 'LATAM' },
  ];

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-card-foreground">Filtros Globales:</span>
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
          Actualizar
        </Button>
      </div>
    </Card>
  );
};