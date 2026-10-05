import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  SlidersHorizontal,
  PackageX,
  Sparkles
} from 'lucide-react';

export const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  /*
   * Fetch products from the Spring Boot backend.
   *
   * The backend exposes:
   * GET /api/products
   *
   * Search and filtering are handled using query parameters:
   * name
   * category
   * minPrice
   * maxPrice
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {};

      if (searchQuery) {
        params.name = searchQuery;
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (minPrice) {
        params.minPrice = minPrice;
      }

      if (maxPrice) {
        params.maxPrice = maxPrice;
      }

      const response = await api.get('/products', { params });

      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Fetch all products and extract unique categories.
   *
   * There is no separate /products/categories endpoint
   * in the current Spring Boot backend.
   */
  const fetchCategories = async () => {
    try {
      const response = await api.get('/products');

      const uniqueCategories = [
        ...new Set(
          response.data
            .map((product) => product.category)
            .filter(Boolean)
        )
      ];

      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setCategories([]);
    }
  };

  /*
   * Load categories when the page is opened.
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /*
   * Fetch products whenever search/filter values change.
   *
   * A 300ms delay prevents an API request on every
   * individual keystroke while typing.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice
  ]);

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px'
      }}
    >
      {/* Hero Banner Header */}
      <div
        className="glass-card"
        style={{
          padding: '40px',
          marginBottom: '36px',
          background:
            'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(30, 41, 59, 0.7) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Project Badge */}
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#818cf8',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            padding: '4px 12px',
            borderRadius: '9999px',
            marginBottom: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={14} />
          SHOP SMART • LIVE BETTER
        </span>

        {/* Page Title */}
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '12px',
            letterSpacing: '-0.02em'
          }}
        >
          Discover Products You'll Love
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '16px',
            color: '#94a3b8',
            maxWidth: '600px',
            lineHeight: 1.6
          }}
        >
          Explore quality products across electronics, clothing, home essentials, and more — all in one place.
        </p>

        {/* Search Input Bar */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '580px',
            marginTop: '28px'
          }}
        >
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
          />

          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              borderRadius: '12px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              fontSize: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          {/* All Categories */}
          <button
            onClick={() => setSelectedCategory('')}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor:
                selectedCategory === '' ? '#6366f1' : '#1e293b',
              color:
                selectedCategory === '' ? '#ffffff' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            All Categories
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor:
                  selectedCategory === cat
                    ? '#6366f1'
                    : '#1e293b',
                color:
                  selectedCategory === cat
                    ? '#ffffff'
                    : '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Filter Sub-bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            padding: '12px 18px',
            background: '#1e293b',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          {/* Filter Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <SlidersHorizontal size={16} />
            Filter Price Range:
          </div>

          {/* Price Inputs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{
                width: '100px',
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc',
                fontSize: '13px'
              }}
            />

            <span style={{ color: '#94a3b8' }}>
              -
            </span>

            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                width: '100px',
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Clear Filters */}
          {(minPrice ||
            maxPrice ||
            searchQuery ||
            selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setMinPrice('');
                  setMaxPrice('');
                }}
                style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginLeft: 'auto',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none'
                }}
              >
                Clear Filters
              </button>
            )}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 0',
            color: '#94a3b8'
          }}
        >
          <p
            style={{
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            Loading product catalog...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#94a3b8'
          }}
        >
          <PackageX
            size={54}
            style={{
              margin: '0 auto 16px',
              opacity: 0.3
            }}
          />

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#f8fafc',
              marginBottom: '8px'
            }}
          >
            No products found
          </h3>

          <p
            style={{
              fontSize: '14px'
            }}
          >
            Try adjusting your search criteria or price filters.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};