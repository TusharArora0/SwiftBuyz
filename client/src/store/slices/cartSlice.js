import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Error loading cart:', error);
    return { items: [] };
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart(),
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item._id === newItem._id);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
      );
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item) {
        item.quantity = quantity;
        state.totalAmount = state.items.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Add middleware to save cart to localStorage
export const cartMiddleware = store => next => action => {
  const result = next(action);
  if (action.type?.startsWith('cart/')) {
    const cart = store.getState().cart;
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  return result;
};

export default cartSlice.reducer; 