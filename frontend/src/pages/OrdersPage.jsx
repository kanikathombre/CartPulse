import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> PLACED</span>;
      case 'CONFIRMED':
        return <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> CONFIRMED</span>;
      case 'SHIPPED':
        return <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Truck size={14} /> SHIPPED</span>;
      case 'DELIVERED':
        return <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> DELIVERED</span>;
      case 'CANCELLED':
        return <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> CANCELLED</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
          My Order History
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Track past orders, view price snapshots at purchase time, and manage order statuses.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>No orders placed yet</h3>
          <p style={{ fontSize: '14px' }}>Browse our product catalog to place your first order!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className="glass-card"
                style={{ overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? '#1e293b' : 'transparent',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#818cf8'
                    }}>
                      <Package size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
                          Order #{order.id}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                        Placed on {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>Total Amount</span>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                        ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                  </div>
                </div>

                {/* Expanded Item Details */}
                {isExpanded && (
                  <div style={{ padding: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#0f172a' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Order Items & Historical Price Snapshot</h4>
                      {order.couponCode && (
                        <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                          Coupon Applied: {order.couponCode} (-₹{Number(order.discount).toFixed(2)})
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            backgroundColor: '#1e293b',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', display: 'block' }}>
                              {item.productName}
                            </span>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                              Qty: {item.quantity} × ₹{Number(item.priceAtPurchase).toFixed(2)} (Price Snapshot)
                            </span>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#6366f1' }}>
                            ₹{Number(item.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Action (Cancel if eligible) */}
                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            fontSize: '13px',
                            fontWeight: 600
                          }}
                        >
                          Cancel Order & Restore Stock
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
