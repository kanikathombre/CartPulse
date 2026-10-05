import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      showNotification('Please login to add items to your cart', 'warning');
      return false;
    }
    try {
      const response = await api.post('/cart/items', { productId, quantity });
      setCart(response.data);
      showNotification('Item added to cart!');
      setIsCartOpen(true);
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add item to cart';
      showNotification(errorMsg, 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      setCart(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update item quantity';
      showNotification(errorMsg, 'error');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      setCart(response.data);
      showNotification('Item removed from cart');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to remove item';
      showNotification(errorMsg, 'error');
    }
  };

  const applyCoupon = async (code) => {
    if (!cart || !cart.subtotal) return false;
    try {
      const response = await api.post('/coupons/validate', {
        code,
        orderAmount: cart.subtotal
      });
      setAppliedCoupon(response.data);
      showNotification(`Coupon ${code} applied successfully!`);
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid coupon code';
      showNotification(errorMsg, 'error');
      setAppliedCoupon(null);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Coupon removed');
  };

  const checkout = async () => {
    try {
      const payload = {
        couponCode: appliedCoupon ? appliedCoupon.code : null
      };
      const response = await api.post('/orders', payload);
      setCart(null);
      setAppliedCoupon(null);
      setIsCartOpen(false);
      await fetchCart();
      showNotification('Order placed successfully!', 'success');
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Checkout failed';
      showNotification(errorMsg, 'error');
      throw err;
    }
  };

  const itemCount = cart?.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        loading,
        notification,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        checkout,
        itemCount,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
