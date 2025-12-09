import { useEffect, useState, useMemo } from 'react';
import { useSalesStore } from '../store/salesStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Download, Search, ArrowUpDown } from 'lucide-react';
import './SalesPage.css';

type SortField = 'date' | 'customer' | 'totalPrice' | 'status';
type SortDirection = 'asc' | 'desc';

export function SalesPage() {
  const { sales, loading, fetchSales } = useSalesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const filteredAndSortedSales = useMemo(() => {
    let filtered = [...sales];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sale => 
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [sales, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Product', 'Customer', 'Quantity', 'Total Price', 'Status'];
    const rows = filteredAndSortedSales.map(sale => [
      sale.date,
      sale.productName,
      sale.customer,
      sale.quantity.toString(),
      sale.totalPrice.toFixed(2),
      sale.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && sales.length === 0) {
    return <LoadingSpinner message="Loading sales data..." />;
  }

  return (
    <div className="sales-page">
      <header className="sales-header">
        <div>
          <h1>Sales Transactions</h1>
          <p>Track and analyze your sales performance</p>
        </div>
        <button className="btn-export" onClick={exportToCSV}>
          <Download size={20} />
          Export CSV
        </button>
      </header>

      <div className="sales-filters">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} className="sortable">
                Date
                <ArrowUpDown size={16} className="sort-icon" />
              </th>
              <th>Product</th>
              <th onClick={() => handleSort('customer')} className="sortable">
                Customer
                <ArrowUpDown size={16} className="sort-icon" />
              </th>
              <th>Quantity</th>
              <th onClick={() => handleSort('totalPrice')} className="sortable">
                Total Price
                <ArrowUpDown size={16} className="sort-icon" />
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status
                <ArrowUpDown size={16} className="sort-icon" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedSales.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                  No sales transactions found
                </td>
              </tr>
            ) : (
              filteredAndSortedSales.map(sale => (
                <tr key={sale.id}>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                  <td>{sale.productName}</td>
                  <td>{sale.customer}</td>
                  <td>{sale.quantity}</td>
                  <td>${sale.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${sale.status}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="sales-summary">
        <div className="summary-item">
          <span className="summary-label">Total Transactions:</span>
          <span className="summary-value">{filteredAndSortedSales.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Revenue:</span>
          <span className="summary-value">
            ${filteredAndSortedSales.reduce((sum, sale) => sum + sale.totalPrice, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
