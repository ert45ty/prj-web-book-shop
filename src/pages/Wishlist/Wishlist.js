import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import WishlistService from "../../services/WishlistService";
import CartService from "../../services/CartService";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, wishlistItems]);

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      removeFromWishlist(productId);
    } catch (err) {
      setError("Cannot delete book, please try again.");
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      await CartService.updateUserCart(user.id, {
        ...product,
        quantity: 1,
      });
      addToCart(product, 1);

      await WishlistService.removeItem(user.id, product.id);
      removeFromWishlist(product.id);
    } catch (err) {
      setError("Cannot add this book to cart, please try again.");
    }
  };

  const handleClearWishlist = async () => {
    try {
      await WishlistService.clearUserWishlist(user.id);
      clearWishlist();
    } catch (err) {
      setError("Cannot delete wishlist, please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-heart fs-1"></i>
        <h3>Wishlist is empty</h3>
        <p className="mt-3 mb-1">You have no book in your wishlist.</p>
        <Link to={"/"} className="btn btn-primary mt-2">
          Go explore more books
        </Link>{" "}
      </div>
    );
  }

  return (
    <div className="row ml-3">
      <h1>My Wishlist</h1>
      {wishlistItems.map((item) => (
        <div className="col-2 mt-3" key={item.id}>
          <div className="card h-100">
            <div className="text-center pt-3">
              <img
                src={item.image}
                className="card-img-top"
                alt={item.title}
                style={{ height: "200px", objectFit: "contain" }}
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text text-muted">Author: {item.author}</p>
              <p className="card-text fw-bold">{item["new-price"]}VNĐ</p>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-primary"
                  onClick={() => handleMoveToCart(item)}
                  disabled={(item.stock = item.quantity) || item.stock <= 0}
                >
                  <i className="bi bi-cart-plus"></i> Add to cart
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button className="btn btn-danger" onClick={handleClearWishlist}>
          Delete all
        </button>

        <Link to={"/"} className="btn btn-primary ml-2">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
