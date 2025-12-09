import { useEffect, useMemo } from 'react';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import { KPICard } from '../components/common/KPICard';
import { SalesChart } from '../components/dashboard/SalesChart';
import { ProductPerformance } from '../components/dashboard/ProductPerformance';
import { useSalesStore } from '../store/salesStore';
import { useProductStore } from '../store/productStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import './DashboardPage.css';

export function DashboardPage() {
  const { metrics, sales, loading: salesLoading, fetchSales } = useSalesStore();
  const { products, loading: productsLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, [fetchSales, fetchProducts]);

  const chartData = useMemo(() => {
    return sales.slice(0, 7).map(sale => ({
      date: sale.date,
      revenue: sale.totalPrice,
      orders: sale.quantity
    }));
  }, [sales]);

  const productPerformanceData = useMemo(() => {
    // Generate stable mock data based on product id
    return products.slice(0, 5).map(product => {
      const seed = parseInt(product.id, 10) || 1;
      return {
        name: product.name.substring(0, 15),
        sales: product.stock > 50 ? Math.floor(seed * 13 % 100) + 50 : product.stock,
        revenue: product.price * ((seed * 7 % 10) + 5)
      };
    });
  }, [products]);

  if (salesLoading || productsLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </header>

      <div className="kpi-grid">
        <KPICard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          change={metrics.growthRate}
          icon={<DollarSign size={24} />}
          trend="up"
        />
        <KPICard
          title="Total Orders"
          value={metrics.totalOrders}
          change={8.3}
          icon={<ShoppingCart size={24} />}
          trend="up"
        />
        <KPICard
          title="Products"
          value={products.length}
          change={2.1}
          icon={<Package size={24} />}
          trend="up"
        />
        <KPICard
          title="Avg Order Value"
          value={`$${metrics.averageOrderValue.toFixed(2)}`}
          change={-1.2}
          icon={<TrendingUp size={24} />}
          trend="down"
        />
      </div>

      <div className="charts-grid">
        <SalesChart data={chartData} />
        <ProductPerformance data={productPerformanceData} />
      </div>
    </div>
  );
}
