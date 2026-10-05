import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, Check, ArrowRight } from 'lucide-react';

export const CartDrawer = ({ onNavigateToLogin }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    checkout,
    itemCount
  } = useCart();
  const { user } = useAuth();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const success = await applyCoupon(couponCodeInput.trim());
    if (success) setCouponCodeInput('');
  };

  const handleCheckout = async () => {
    if (!user) {
      setIsCartOpen(false);
      onNavigateToLogin();
      return;
    }
    try {
      setIsSubmitting(true);
      await checkout();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cart?.subtotal || 0;
  const discount = appliedCoupon?.calculatedDiscount || 0;
  const finalTotal = appliedCoupon ? appliedCoupon.finalAmount : subtotal;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Drawer Panel */}
      <div
        className="animate-slide-left"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#0f172a',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '-10px 0 25px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 210
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag color="#6366f1" size={24} />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
              Shopping Cart ({itemCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ padding: '6px', borderRadius: '6px', color: '#94a3b8', hover: { color: '#ffffff' } }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body - Items List */}
        <div style={{ padding: '24px', flexGrow: 1, overflowY: 'auto' }}>
          {!cart || !cart.items || cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', marginBottom: '8px' }}>Your cart is empty</p>
              <p style={{ fontSize: '13px' }}>Explore our catalog and add items to your cart!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                    alt={item.productName}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', lineHeight: 1.2 }}>
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ color: '#ef4444', padding: '2px', opacity: 0.8 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          style={{ color: '#94a3b8', opacity: item.quantity <= 1 ? 0.4 : 1 }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ color: '#94a3b8' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#6366f1' }}>
                        ₹{Number(item.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer - Coupon & Checkout */}
        {cart && cart.items && cart.items.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#1e293b' }}>
            {/* Coupon Code Section */}
            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flexGrow: 1 }}>
                  <Tag size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. SAVE10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '8px',
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f8fafc',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '0 16px',
                    borderRadius: '8px',
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Apply
                </button>
              </form>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="#10b981" />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', display: 'block' }}>
                      Coupon '{appliedCoupon.code}' Applied!
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {appliedCoupon.discountPercentage}% discount saved ₹{Number(discount).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button onClick={removeCoupon} style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                  Remove
                </button>
              </div>
            )}

            {/* Price Summary Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Subtotal</span>
                <span>₹{Number(subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{Number(discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontSize: '18px', fontWeight: 800, paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span>Total</span>
                <span>₹{Number(finalTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
              }}
            >
              {isSubmitting ? (
                'Processing Order...'
              ) : (
                <>
                  {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
