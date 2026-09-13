import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (item, quantity, customizations, unitPrice) => {
    setCartItems(prev => {
      const existing = prev.find(i => 
        i.menuItemId === item._id && 
        JSON.stringify(i.customizations) === JSON.stringify(customizations)
      );
      
      if (existing) {
        return prev.map(i => 
          i === existing ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      
      return [...prev, {
        menuItemId: item._id,
        name: item.name,
        quantity,
        unitPrice,
        customizations
      }];
    });
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setCartItems(prev => prev.map((item, i) => {
      if (i === index) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const taxes = subtotal * 0.12;
  const total = subtotal + taxes;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, taxes, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
