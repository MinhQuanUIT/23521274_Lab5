import { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './KPICard.css';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

export const KPICard = memo(function KPICard({ 
  title, 
  value, 
  change, 
  icon, 
  trend 
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="trend-icon up" />;
      case 'down':
        return <TrendingDown className="trend-icon down" />;
      default:
        return <Minus className="trend-icon neutral" />;
    }
  };

  const getTrendClass = () => {
    switch (trend) {
      case 'up':
        return 'positive';
      case 'down':
        return 'negative';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div className="kpi-icon">{icon}</div>
        <h3 className="kpi-title">{title}</h3>
      </div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-change ${getTrendClass()}`}>
        {getTrendIcon()}
        <span>{Math.abs(change)}%</span>
        <span className="change-label">vs last period</span>
      </div>
    </div>
  );
});
