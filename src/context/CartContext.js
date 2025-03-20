import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import CartService from "../services/CartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isAuthenticated && user) {
          const response = await CartService.getUserCart(user.id);
          if (response.data[0]) {
            setCartItems(response.data[0].items);
          } else {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Failed to load cart items");
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  const addToCart = async (product) => {
    if (!isAuthenticated && !user) {
      alert("Please login to add book to cart");
      return;
    }
    try {
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );
      let updatedCart;

      if (existingItemIndex >= 0) {
        updatedCart = [...cartItems];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
      } else {
        const newItem = {
          ...product,
          quantity: 1,
        };
        updatedCart = [...cartItems];
        updatedCart.push(newItem);
      }

      setCartItems(updatedCart);

      await CartService.updateUserCart(user.id, updatedCart, product.id);
      alert("Add to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add item to cart");
    }
  };
  const removeFromCart = async (productId) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== productId);

      setCartItems(updatedCart);

      if (isAuthenticated && user) {
        await CartService.updateUserCart(user.id, updatedCart);
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError("Failed to remove item from cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity < 1) return;

      const updatedCart = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );

      setCartItems(updatedCart);

      if (isAuthenticated && user) {
        await CartService.updateUserCart(user.id, updatedCart, productId);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);

      if (isAuthenticated && user) {
        await CartService.clearUserCart(user.id);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
