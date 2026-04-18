"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "linen-form-cart";

function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image,
    leadTime: product.leadTime,
    priceInCents: product.priceInCents || 0,
    quantity: 1
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      setItems({});
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  function addItem(product) {
    if (!product?.id || !(product.priceInCents > 0)) {
      return;
    }

    setItems((current) => {
      const existing = current[product.id];

      return {
        ...current,
        [product.id]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : normalizeProduct(product)
      };
    });
  }

  function updateQuantity(productId, nextQuantity) {
    setItems((current) => {
      if (nextQuantity <= 0) {
        const updated = { ...current };
        delete updated[productId];
        return updated;
      }

      return {
        ...current,
        [productId]: {
          ...current[productId],
          quantity: nextQuantity
        }
      };
    });
  }

  function clearCart() {
    setItems({});
  }

  const value = useMemo(() => {
    const cartItems = Object.values(items);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.priceInCents * item.quantity,
      0
    );

    return {
      hydrated,
      cartItems,
      cartCount,
      subtotal,
      addItem,
      updateQuantity,
      clearCart
    };
  }, [hydrated, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
