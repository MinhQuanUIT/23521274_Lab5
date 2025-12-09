import { memo, useState } from 'react';
import type { Product } from '../../types';
import { useIntersectionObserver } from '../../hooks';
import { Edit, Trash2, Package } from 'lucide-react';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = memo(function ProductCard({ 
  product, 
  onEdit, 
  onDelete 
}: ProductCardProps) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });
  const [imageLoaded, setImageLoaded] = useState(false);

  const getStatusClass = () => {
    switch (product.status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'out-of-stock':
        return 'status-out';
      default:
        return '';
    }
  };

  return (
    <div 
      ref={ref}
      className={`product-card ${isVisible ? 'visible' : ''}`}
    >
      <div className="product-image-container">
        {!imageLoaded && (
          <div className="image-placeholder">
            <Package size={48} />
          </div>
        )}
        <img 
          src={product.image} 
          alt={product.name}
          className={`product-image ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        <span className={`product-status ${getStatusClass()}`}>
          {product.status.replace('-', ' ')}
        </span>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        
        <div className="product-details">
          <div className="detail-item">
            <span className="detail-label">Price:</span>
            <span className="detail-value">${product.price.toFixed(2)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Stock:</span>
            <span className="detail-value">{product.stock}</span>
          </div>
        </div>

        <div className="product-actions">
          <button 
            className="btn-edit"
            onClick={() => onEdit(product)}
            aria-label="Edit product"
          >
            <Edit size={16} />
            Edit
          </button>
          <button 
            className="btn-delete"
            onClick={() => onDelete(product.id)}
            aria-label="Delete product"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});
