import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    setCart: (state, action) => {
        return action.payload;
      },
    addToCart: (state, action) => {
      const existingItem = state.find(item => item.id === action.payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      return state.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
        const { productId, quantity } = action.payload;
        const existingItem = state.find(item => item.id === productId);
  
        if (existingItem) {
          existingItem.quantity = parseInt(quantity, 10);
        }
      },
    clearCart: () => [],
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart,setCart } = cartSlice.actions;

export default cartSlice.reducer;
