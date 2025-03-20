import React from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default AppProvider;
