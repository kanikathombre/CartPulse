import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export const NotificationToast = () => {
  const { notification } = useCart();

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'warning':
        return <AlertTriangle style={{ color: '#f59e0b' }} size={20} />;
      case 'error':
        return <AlertCircle style={{ color: '#ef4444' }} size={20} />;
      default:
        return <CheckCircle2 style={{ color: '#10b981' }} size={20} />;
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        background: '#1e293b',
        color: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
      }}
    >
      {getIcon()}
      <span style={{ fontSize: '14px', fontWeight: 500 }}>{notification.message}</span>
    </div>
  );
};
