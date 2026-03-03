/**
 * Cart Context
 *
 * Manages shopping cart state with localStorage persistence.
 * Each cart item: { product, variantId, size, price, quantity, name, image }
 */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

const CART_KEY = 'pb_cart';

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, variant, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product === product._id && item.variantId === variant._id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        toast.success(`Updated quantity`);
        return updated;
      }

      const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

      toast.success(`Added to cart`);
      return [
        ...prev,
        {
          product: product._id,
          variantId: variant._id,
          name: product.name,
          size: variant.size,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          image: primaryImage?.url || '',
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (product, variantId, quantity) => {
    if (quantity < 1) {
      removeItem(product, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product === product && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (product, variantId) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product === product && item.variantId === variantId)
      )
    );
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const cartSummary = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = subtotal >= 499 ? 0 : 49;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = subtotal + shippingCost + tax;

    return { totalItems, subtotal, shippingCost, tax, total };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        ...cartSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
