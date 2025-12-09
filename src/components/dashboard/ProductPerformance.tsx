import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ProductPerformance.css';

interface ProductPerformanceProps {
  data: Array<{ name: string; sales: number; revenue: number }>;
}

export const ProductPerformance = memo(function ProductPerformance({ data }: ProductPerformanceProps) {
  return (
    <div className="product-performance">
      <h3 className="chart-title">Product Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="sales" fill="#667eea" radius={[8, 8, 0, 0]} />
          <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
