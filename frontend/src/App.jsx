import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { NotificationToast } from './components/NotificationToast';
import { CatalogPage } from './pages/CatalogPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function AppContent() {
  const [currentView, setCurrentView] = useState('catalog');

  const renderView = () => {
    switch (currentView) {
      case 'catalog':
        return <CatalogPage />;
      case 'orders':
        return <OrdersPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'login':
        return (
          <LoginPage
            onNavigateToRegister={() => setCurrentView('register')}
            onLoginSuccess={() => setCurrentView('catalog')}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onNavigateToLogin={() => setCurrentView('login')}
            onRegisterSuccess={() => setCurrentView('catalog')}
          />
        );
      default:
        return <CatalogPage />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main style={{ flexGrow: 1 }}>
        {renderView()}
      </main>
      <CartDrawer onNavigateToLogin={() => setCurrentView('login')} />
      <NotificationToast />

      {/* Footer */}
      <footer style={{
        padding: '24px 0',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '13px',
        backgroundColor: '#0f172a'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          © 2026 CartPulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
