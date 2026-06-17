import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('prinstan_cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('prinstan_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = '100 ml', quantity = 1) => {
    setCartItems(prev => {
      // Normalize sizes to match strings like "100ml", "250ml", "500ml", "1l" or "100 ml"
      const cleanSize = size.trim().toLowerCase().replace(/\s+/g, '');
      const existingItemIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.size.trim().toLowerCase().replace(/\s+/g, '') === cleanSize
      );

      if (existingItemIndex > -1) {
        const updated = [...prev];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      }

      return [...prev, {
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        size: size, // Store the exact display string (e.g. "100ml", "1 L")
        quantity: quantity
      }];
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems(prev => {
      const cleanSize = size.trim().toLowerCase().replace(/\s+/g, '');
      return prev.filter(item => 
        !(item.id === id && item.size.trim().toLowerCase().replace(/\s+/g, '') === cleanSize)
      );
    });
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCartItems(prev => {
      const cleanSize = size.trim().toLowerCase().replace(/\s+/g, '');
      return prev.map(item => {
        if (item.id === id && item.size.trim().toLowerCase().replace(/\s+/g, '') === cleanSize) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
