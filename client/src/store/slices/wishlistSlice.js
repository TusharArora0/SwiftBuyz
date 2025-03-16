import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch wishlist items
export const fetchWishlistItems = createAsyncThunk(
  'wishlist/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return [];
      
      const response = await fetch('http://localhost:5000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add item to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addItem',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to wishlist');
      }
      
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove item from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeItem',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }
      
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist items
      .addCase(fetchWishlistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add to wishlist
      .addCase(addToWishlist.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        state.loading = false;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 