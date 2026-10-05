import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, CheckCircle2, XCircle } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%'
      }}
    >
      {/* Product Image Container */}
      <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        
        {/* Category Tag */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          color: '#818cf8',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          {product.category || 'General'}
        </span>

        {/* Stock Badge */}
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: isOutOfStock ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {isOutOfStock ? (
            <>
              <XCircle size={12} /> Out of Stock
            </>
          ) : (
            <>
              <CheckCircle2 size={12} /> {product.stock} left
            </>
          )}
        </span>
      </div>

      {/* Body Details */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Price</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
              ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={() => addToCart(product.id, 1)}
            disabled={isOutOfStock}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              backgroundColor: isOutOfStock ? '#334155' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              background: isOutOfStock ? '#334155' : '#6366f1',
              color: isOutOfStock ? '#94a3b8' : '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, transform 0.1s',
              boxShadow: isOutOfStock ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
