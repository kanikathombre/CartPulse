import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ShoppingCart, User as UserIcon, LogOut, Shield, Package, Store } from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('catalog')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <ShoppingBag color="#ffffff" size={22} />
          </div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CartPulse
            </span>
            <span style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '-2px' }}>
              E-Commerce Store
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentView('catalog')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              color: currentView === 'catalog' ? '#ffffff' : '#94a3b8',
              backgroundColor: currentView === 'catalog' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <Store size={16} />
            Products
          </button>

          {user && (
            <button
              onClick={() => setCurrentView('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                color: currentView === 'orders' ? '#ffffff' : '#94a3b8',
                backgroundColor: currentView === 'orders' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <Package size={16} />
              My Orders
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                color: currentView === 'admin' ? '#f59e0b' : '#94a3b8',
                backgroundColor: currentView === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <Shield size={16} />
              Admin Portal
            </button>
          )}
        </nav>

        {/* Right Actions (Cart, User, Auth) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              padding: '10px',
              borderRadius: '10px',
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s'
            }}
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#6366f1',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.5)'
              }}>
                {itemCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                  {user.name || user.email}
                </span>
                <span style={{
                  display: 'inline-block',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: isAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isAdmin ? '#f59e0b' : '#10b981',
                  textTransform: 'uppercase'
                }}>
                  {isAdmin ? 'ADMIN' : 'USER'}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setCurrentView('catalog');
                }}
                title="Logout"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  transition: 'background 0.2s'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setCurrentView('login')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('register')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
