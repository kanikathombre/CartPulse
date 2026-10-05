import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Package,
  Users,
  ShoppingBag,
  Clock,
  DollarSign,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // PRODUCT FORM STATE
  // =========================================================
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: ''
  });

  // =========================================================
  // COUPON FORM STATE
  // =========================================================
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);

  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercentage: '',
    minimumOrderAmount: '',
    maximumDiscount: '',
    expiryDate: '',
    active: true
  });

  // =========================================================
  // FETCH STATS
  // =========================================================
  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // =========================================================
  // FETCH ORDERS
  // =========================================================
  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // =========================================================
  // FETCH COUPONS
  // =========================================================
  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // =========================================================
  // LOAD ALL ADMIN DATA
  // =========================================================
  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      fetchStats(),
      fetchProducts(),
      fetchOrders(),
      fetchCoupons()
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================================
  // SAVE PRODUCT
  // CREATE OR UPDATE
  // =========================================================
  const handleSaveProduct = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock, 10)
      };

      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setShowProductModal(false);
      setEditingProductId(null);

      setProductForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        imageUrl: ''
      });

      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to save product'
      );
    }
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to delete product'
      );
    }
  };

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================
  const handleUpdateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      await api.put(
        `/orders/${orderId}/status`,
        { status: newStatus }
      );

      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to update order status'
      );
    }
  };

  // =========================================================
  // SAVE COUPON
  // CREATE OR UPDATE
  // =========================================================
  const handleSaveCoupon = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        code: couponForm.code.trim().toUpperCase(),
        discountPercentage: parseFloat(
          couponForm.discountPercentage
        ),
        minimumOrderAmount: parseFloat(
          couponForm.minimumOrderAmount
        ),
        maximumDiscount: couponForm.maximumDiscount
          ? parseFloat(couponForm.maximumDiscount)
          : null,
        expiryDate: new Date(
          couponForm.expiryDate
        ).toISOString(),
        active: couponForm.active
      };

      if (editingCouponId) {
        // UPDATE EXISTING COUPON
        await api.put(
          `/coupons/${editingCouponId}`,
          payload
        );
      } else {
        // CREATE NEW COUPON
        await api.post('/coupons', payload);
      }

      setShowCouponModal(false);
      setEditingCouponId(null);

      setCouponForm({
        code: '',
        discountPercentage: '',
        minimumOrderAmount: '',
        maximumDiscount: '',
        expiryDate: '',
        active: true
      });

      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        (
          editingCouponId
            ? 'Failed to update coupon'
            : 'Failed to create coupon'
        )
      );
    }
  };

  // =========================================================
  // DELETE COUPON
  // =========================================================
  const handleDeleteCoupon = async (id, code) => {
    if (
      !window.confirm(
        `Delete coupon "${code}"?`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/coupons/${id}`);
      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to delete coupon'
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px',
          color: '#94a3b8'
        }}
      >
        Loading Admin Portal...
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px'
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '8px'
            }}
          >
            Admin Management Portal
          </h1>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '14px'
            }}
          >
            Overview of store performance metrics,
            catalog management, customer orders,
            and discount coupons.
          </p>
        </div>
      </div>

      {/* =====================================================
          TABS BAR
      ===================================================== */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom:
            '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '12px'
        }}
      >

        {/* STATS TAB */}
        <button
          onClick={() => setActiveTab('stats')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            color:
              activeTab === 'stats'
                ? '#ffffff'
                : '#94a3b8',
            backgroundColor:
              activeTab === 'stats'
                ? 'rgba(99, 102, 241, 0.2)'
                : 'transparent'
          }}
        >
          Analytics Dashboard
        </button>

        {/* PRODUCTS TAB */}
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            color:
              activeTab === 'products'
                ? '#ffffff'
                : '#94a3b8',
            backgroundColor:
              activeTab === 'products'
                ? 'rgba(99, 102, 241, 0.2)'
                : 'transparent'
          }}
        >
          Product Catalog ({products.length})
        </button>

        {/* ORDERS TAB */}
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            color:
              activeTab === 'orders'
                ? '#ffffff'
                : '#94a3b8',
            backgroundColor:
              activeTab === 'orders'
                ? 'rgba(99, 102, 241, 0.2)'
                : 'transparent'
          }}
        >
          Customer Orders ({orders.length})
        </button>

        {/* COUPONS TAB */}
        <button
          onClick={() => setActiveTab('coupons')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            color:
              activeTab === 'coupons'
                ? '#ffffff'
                : '#94a3b8',
            backgroundColor:
              activeTab === 'coupons'
                ? 'rgba(99, 102, 241, 0.2)'
                : 'transparent'
          }}
        >
          Coupons ({coupons.length})
        </button>
      </div>

      {/* =====================================================
          STATS TAB
      ===================================================== */}
      {activeTab === 'stats' && stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}
        >

          {/* REVENUE */}
          <div
            className="glass-card"
            style={{ padding: '24px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#818cf8',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#94a3b8'
                }}
              >
                Total Revenue
              </span>

              <DollarSign size={22} />
            </div>

            <span
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff'
              }}
            >
              ₹
              {Number(
                stats.totalRevenue
              ).toLocaleString(
                'en-IN',
                {
                  minimumFractionDigits: 2
                }
              )}
            </span>
          </div>

          {/* ORDERS */}
          <div
            className="glass-card"
            style={{ padding: '24px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#10b981',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#94a3b8'
                }}
              >
                Total Orders
              </span>

              <ShoppingBag size={22} />
            </div>

            <span
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff'
              }}
            >
              {stats.totalOrders}
            </span>
          </div>

          {/* PENDING ORDERS */}
          <div
            className="glass-card"
            style={{ padding: '24px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#f59e0b',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#94a3b8'
                }}
              >
                Pending Orders
              </span>

              <Clock size={22} />
            </div>

            <span
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff'
              }}
            >
              {stats.pendingOrders}
            </span>
          </div>

          {/* PRODUCTS */}
          <div
            className="glass-card"
            style={{ padding: '24px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#38bdf8',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#94a3b8'
                }}
              >
                Active Products
              </span>

              <Package size={22} />
            </div>

            <span
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff'
              }}
            >
              {stats.totalProducts}
            </span>
          </div>

          {/* USERS */}
          <div
            className="glass-card"
            style={{ padding: '24px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#c084fc',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#94a3b8'
                }}
              >
                Registered Users
              </span>

              <Users size={22} />
            </div>

            <span
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff'
              }}
            >
              {stats.totalUsers}
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          PRODUCTS TAB
      ===================================================== */}
      {activeTab === 'products' && (
        <div>

          {/* ADD PRODUCT BUTTON */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '20px'
            }}
          >
            <button
              onClick={() => {
                setEditingProductId(null);

                setProductForm({
                  name: '',
                  description: '',
                  price: '',
                  stock: '',
                  category: '',
                  imageUrl: ''
                });

                setShowProductModal(true);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: '#6366f1',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              Add New Product
            </button>
          </div>

          {/* PRODUCT TABLE */}
          <div
            className="glass-card"
            style={{ overflow: 'hidden' }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '14px'
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom:
                      '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: '#1e293b',
                    color: '#94a3b8'
                  }}
                >
                  <th style={{ padding: '14px 20px' }}>
                    Product
                  </th>

                  <th style={{ padding: '14px 20px' }}>
                    Category
                  </th>

                  <th style={{ padding: '14px 20px' }}>
                    Price
                  </th>

                  <th style={{ padding: '14px 20px' }}>
                    Stock
                  </th>

                  <th
                    style={{
                      padding: '14px 20px',
                      textAlign: 'right'
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom:
                        '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <td
                      style={{
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <img
                        src={
                          p.imageUrl ||
                          'https://via.placeholder.com/40'
                        }
                        alt=""
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          objectFit: 'cover'
                        }}
                      />

                      <span
                        style={{
                          fontWeight: 600,
                          color: '#f8fafc'
                        }}
                      >
                        {p.name}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: '14px 20px',
                        color: '#94a3b8'
                      }}
                    >
                      {p.category}
                    </td>

                    <td
                      style={{
                        padding: '14px 20px',
                        fontWeight: 700,
                        color: '#ffffff'
                      }}
                    >
                      ₹{Number(p.price).toFixed(2)}
                    </td>

                    <td
                      style={{
                        padding: '14px 20px',
                        color:
                          p.stock > 0
                            ? '#10b981'
                            : '#ef4444',
                        fontWeight: 600
                      }}
                    >
                      {p.stock}
                    </td>

                    <td
                      style={{
                        padding: '14px 20px',
                        textAlign: 'right'
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditingProductId(p.id);

                          setProductForm({
                            name: p.name,
                            description: p.description,
                            price: p.price,
                            stock: p.stock,
                            category: p.category,
                            imageUrl:
                              p.imageUrl || ''
                          });

                          setShowProductModal(true);
                        }}
                        title="Edit Product"
                        style={{
                          color: '#818cf8',
                          marginRight: '12px'
                        }}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteProduct(p.id)
                        }
                        title="Delete Product"
                        style={{
                          color: '#ef4444'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================
          ORDERS TAB
      ===================================================== */}
      {activeTab === 'orders' && (
        <div
          className="glass-card"
          style={{ overflow: 'hidden' }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '14px'
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom:
                    '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8'
                }}
              >
                <th style={{ padding: '14px 20px' }}>
                  Order ID
                </th>

                <th style={{ padding: '14px 20px' }}>
                  Customer
                </th>

                <th style={{ padding: '14px 20px' }}>
                  Total Amount
                </th>

                <th style={{ padding: '14px 20px' }}>
                  Status
                </th>

                <th
                  style={{
                    padding: '14px 20px',
                    textAlign: 'right'
                  }}
                >
                  Update Status
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  style={{
                    borderBottom:
                      '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <td
                    style={{
                      padding: '14px 20px',
                      fontWeight: 700,
                      color: '#f8fafc'
                    }}
                  >
                    #{o.id}
                  </td>

                  <td
                    style={{
                      padding: '14px 20px'
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        color: '#f8fafc',
                        fontWeight: 600
                      }}
                    >
                      {o.userName}
                    </span>

                    <span
                      style={{
                        fontSize: '12px',
                        color: '#94a3b8'
                      }}
                    >
                      {o.userEmail}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: '14px 20px',
                      fontWeight: 700,
                      color: '#ffffff'
                    }}
                  >
                    ₹
                    {Number(
                      o.totalAmount
                    ).toFixed(2)}
                  </td>

                  <td
                    style={{
                      padding: '14px 20px',
                      fontWeight: 700
                    }}
                  >
                    {o.status}
                  </td>

                  <td
                    style={{
                      padding: '14px 20px',
                      textAlign: 'right'
                    }}
                  >
                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(
                          o.id,
                          e.target.value
                        )
                      }
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#0f172a',
                        border:
                          '1px solid rgba(255,255,255,0.1)',
                        color: '#f8fafc',
                        fontSize: '13px'
                      }}
                    >
                      <option value="PLACED">
                        PLACED
                      </option>

                      <option value="CONFIRMED">
                        CONFIRMED
                      </option>

                      <option value="SHIPPED">
                        SHIPPED
                      </option>

                      <option value="DELIVERED">
                        DELIVERED
                      </option>

                      <option value="CANCELLED">
                        CANCELLED
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================
          COUPONS TAB
      ===================================================== */}
      {activeTab === 'coupons' && (
        <div>

          {/* CREATE COUPON BUTTON */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '20px'
            }}
          >
            <button
              onClick={() => {
                setEditingCouponId(null);

                setCouponForm({
                  code: '',
                  discountPercentage: '',
                  minimumOrderAmount: '',
                  maximumDiscount: '',
                  expiryDate: '',
                  active: true
                });

                setShowCouponModal(true);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: '#6366f1',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              Create Coupon
            </button>
          </div>

          {/* COUPON TABLE */}
          <div
            className="glass-card"
            style={{ overflow: 'hidden' }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '14px'
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom:
                      '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: '#1e293b',
                    color: '#94a3b8'
                  }}
                >
                  <th style={{ padding: '14px 20px' }}>
                    Code
                  </th>

                  <th style={{ padding: '14px 20px' }}>
                    Discount
                  </th>

                  <th style={{ padding: '14px 20px' }}>
                    Min Order
                  </th>

                  <th style={{ padding: '14px 20px' }}>
                    Max Discount
                  </th>

                  <th style={{ padding: '14px 20px' }}>
                    Expiry
                  </th>

                  <th
                    style={{
                      padding: '14px 20px',
                      textAlign: 'right'
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {coupons.map((c) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom:
                        '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <td
                      style={{
                        padding: '14px 20px',
                        fontWeight: 700,
                        color: '#10b981'
                      }}
                    >
                      {c.code}
                    </td>

                    <td
                      style={{
                        padding: '14px 20px',
                        color: '#ffffff'
                      }}
                    >
                      {c.discountPercentage}% OFF
                    </td>

                    <td
                      style={{
                        padding: '14px 20px',
                        color: '#94a3b8'
                      }}
                    >
                      ₹
                      {Number(
                        c.minimumOrderAmount
                      ).toFixed(2)}
                    </td>

                    <td
                      style={{
                        padding: '14px 20px',
                        color: '#94a3b8'
                      }}
                    >
                      {c.maximumDiscount
                        ? `₹${Number(
                          c.maximumDiscount
                        ).toFixed(2)}`
                        : 'No Cap'}
                    </td>

                    <td
                      style={{
                        padding: '14px 20px',
                        color: '#94a3b8'
                      }}
                    >
                      {new Date(
                        c.expiryDate
                      ).toLocaleDateString()}
                    </td>

                    {/* COUPON ACTIONS */}
                    <td
                      style={{
                        padding: '14px 20px',
                        textAlign: 'right'
                      }}
                    >
                      {/* EDIT COUPON */}
                      <button
                        onClick={() => {
                          setEditingCouponId(c.id);

                          setCouponForm({
                            code: c.code,
                            discountPercentage:
                              c.discountPercentage,
                            minimumOrderAmount:
                              c.minimumOrderAmount,
                            maximumDiscount:
                              c.maximumDiscount ??
                              '',
                            expiryDate:
                              c.expiryDate
                                ? new Date(
                                  c.expiryDate
                                )
                                  .toISOString()
                                  .slice(0, 16)
                                : '',
                            active:
                              c.active ?? true
                          });

                          setShowCouponModal(true);
                        }}
                        title="Edit Coupon"
                        style={{
                          color: '#818cf8',
                          marginRight: '14px'
                        }}
                      >
                        <Edit2 size={17} />
                      </button>

                      {/* DELETE COUPON */}
                      <button
                        onClick={() =>
                          handleDeleteCoupon(
                            c.id,
                            c.code
                          )
                        }
                        title="Delete Coupon"
                        style={{
                          color: '#ef4444'
                        }}
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================
          PRODUCT FORM MODAL
      ===================================================== */}
      {showProductModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              'rgba(15,23,42,0.8)'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '28px',
              backgroundColor: '#1e293b'
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '20px'
              }}
            >
              {editingProductId
                ? 'Edit Product'
                : 'Add New Product'}
            </h3>

            <form
              onSubmit={handleSaveProduct}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <input
                type="text"
                placeholder="Product Name"
                required
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    name: e.target.value
                  })
                }
                style={inputStyle}
              />

              <textarea
                placeholder="Description"
                required
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value
                  })
                }
                style={{
                  ...inputStyle,
                  minHeight: '80px'
                }}
              />

              <div
                style={{
                  display: 'flex',
                  gap: '12px'
                }}
              >
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price ₹"
                  required
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      price: e.target.value
                    })
                  }
                  style={inputStyle}
                />

                <input
                  type="number"
                  placeholder="Stock Qty"
                  required
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      stock: e.target.value
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <input
                type="text"
                placeholder="Category (e.g. Electronics)"
                required
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    category: e.target.value
                  })
                }
                style={inputStyle}
              />

              <input
                type="url"
                placeholder="Image URL (optional)"
                value={productForm.imageUrl}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    imageUrl: e.target.value
                  })
                }
                style={inputStyle}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '12px'
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowProductModal(false)
                  }
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    color: '#94a3b8'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#6366f1',
                    color: '#ffffff',
                    fontWeight: 600
                  }}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          COUPON FORM MODAL
      ===================================================== */}
      {showCouponModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              'rgba(15,23,42,0.8)'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              backgroundColor: '#1e293b'
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '20px'
              }}
            >
              {editingCouponId
                ? 'Edit Discount Coupon'
                : 'Create Discount Coupon'}
            </h3>

            <form
              onSubmit={handleSaveCoupon}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >

              {/* COUPON CODE */}
              <input
                type="text"
                placeholder="Coupon Code (e.g. SAVE20)"
                required
                value={couponForm.code}
                disabled={!!editingCouponId}
                onChange={(e) =>
                  setCouponForm({
                    ...couponForm,
                    code: e.target.value
                  })
                }
                style={{
                  ...inputStyle,
                  opacity:
                    editingCouponId ? 0.6 : 1
                }}
              />

              <div
                style={{
                  display: 'flex',
                  gap: '12px'
                }}
              >

                {/* DISCOUNT */}
                <input
                  type="number"
                  step="0.1"
                  placeholder="Discount %"
                  required
                  value={
                    couponForm.discountPercentage
                  }
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      discountPercentage:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                />

                {/* MINIMUM ORDER */}
                <input
                  type="number"
                  step="0.01"
                  placeholder="Min Order ₹"
                  required
                  value={
                    couponForm.minimumOrderAmount
                  }
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      minimumOrderAmount:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                />
              </div>

              {/* MAX DISCOUNT */}
              <input
                type="number"
                step="0.01"
                placeholder="Max Discount Cap ₹ (optional)"
                value={
                  couponForm.maximumDiscount
                }
                onChange={(e) =>
                  setCouponForm({
                    ...couponForm,
                    maximumDiscount:
                      e.target.value
                  })
                }
                style={inputStyle}
              />

              {/* EXPIRY DATE */}
              <input
                type="datetime-local"
                required
                value={couponForm.expiryDate}
                onChange={(e) =>
                  setCouponForm({
                    ...couponForm,
                    expiryDate:
                      e.target.value
                  })
                }
                style={inputStyle}
              />

              {/* ACTIVE CHECKBOX */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#cbd5e1',
                  fontSize: '14px'
                }}
              >
                <input
                  type="checkbox"
                  checked={couponForm.active}
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      active:
                        e.target.checked
                    })
                  }
                />

                Active Coupon
              </label>

              {/* MODAL BUTTONS */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '12px'
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowCouponModal(false);
                    setEditingCouponId(null);
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    color: '#94a3b8'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#6366f1',
                    color: '#ffffff',
                    fontWeight: 600
                  }}
                >
                  {editingCouponId
                    ? 'Update Coupon'
                    : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// =========================================================
// COMMON INPUT STYLE
// =========================================================
const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f8fafc',
  fontSize: '14px'
};