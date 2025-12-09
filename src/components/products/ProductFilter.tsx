import { memo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { ProductFilters } from '../../types';
import './ProductFilter.css';

interface ProductFilterProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
}

export const ProductFilter = memo(function ProductFilter({ 
  filters, 
  onFilterChange 
}: ProductFilterProps) {
  return (
    <div className="product-filter">
      <div className="filter-search">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="search-input"
        />
      </div>

      <div className="filter-controls">
        <SlidersHorizontal size={20} />
        
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Accessories">Accessories</option>
        </select>

        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
});
