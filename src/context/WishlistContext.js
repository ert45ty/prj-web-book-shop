import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import WishlistService from "../services/WishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isAuthenticated && user) {
          const response = await WishlistService.getUserWishlist(user.id);
          if (response.data[0]) {
            setWishlistItems(response.data[0].items);
          } else setWishlistItems([]);
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        console.error("Error loading wishlist:", err);
        setError("Failed to load wishlist items");
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [isAuthenticated, user]);

  const addToWishlist = async (product) => {
    if (!isAuthenticated && !user) {
      alert("Please login to add book to wishlist");
      return;
    }
    try {
      if (wishlistItems.some((item) => item.productId === product.id)) {
        await removeFromWishlist(product);
        return;
      }

      const updatedWishlist = [...wishlistItems, product];
      setWishlistItems(updatedWishlist);
      if (isAuthenticated && user) {
        await WishlistService.updateUserWishlist(user.id, updatedWishlist);
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setError("Failed to add item to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const updatedWishlist = wishlistItems.filter(
        (item) => item.id !== productId
      );

      setWishlistItems(updatedWishlist);
      if (isAuthenticated && user) {
        await WishlistService.updateUserWishlist(user.id, updatedWishlist);
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError("Failed to remove item from wishlist");
    }
  };

  const clearWishlist = async () => {
    try {
      setWishlistItems([]);
      if (isAuthenticated && user) {
        await WishlistService.clearUserWishlist(user.id);
      }
    } catch (err) {
      console.error("Error clearing wishlist:", err);
      setError("Failed to clear wishlist");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
