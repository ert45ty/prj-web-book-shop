import React from "react";
import { Link } from "react-router-dom/dist";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import StarRating from "../components/StarRating";

const Product = ({ book }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist, wishlistItems } =
    useWishlist();

  const handleToggleWishlist = (e) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const handleAddToCart = (e) => {
    addToCart(book);
  };

  return (
    <>
      <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-6 pro-gl-content">
        <div className="ec-product-inner">
          <div className="ec-pro-image-outer">
            <div className="ec-pro-image">
              <Link to={`/books/${book.id}`} className="image">
                <img
                  className="main-image"
                  width={"300px"}
                  height={"300px"}
                  src={book.image}
                  alt={book.title}
                />
                <img
                  className="hover-image"
                  src={book.image}
                  alt={book.title}
                />
              </Link>
              {book.discountPercent > 0 && (
                <span className="percentage">{book.discountPercent}%</span>
              )}

              <div className="ec-pro-actions">
                <button title="Add to Cart" className="add-to-cart">
                  <img
                    src="assets/images/icons/cart.svg"
                    className="svg_img pro_svg"
                    alt=""
                    onClick={handleAddToCart}
                    disabled={book.stock <= 0}
                  />{" "}
                  Add To Cart
                </button>
                <button
                  className={
                    isInWishlist(book.id)
                      ? "ec-btn-group wishlist active"
                      : "ec-btn-group wishlist"
                  }
                  title={
                    isInWishlist(book.id)
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                  onClick={handleToggleWishlist}
                >
                  <img
                    src="assets/images/icons/wishlist.svg"
                    className="svg_img pro_svg"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="ec-pro-content">
            <h5 className="ec-pro-title">
              <Link to={`/books/${book.id}`}>{book.title}</Link>
            </h5>
            <StarRating value={parseFloat(book.rating)} readOnly={true} />
            <span className="ec-price">
              {book["old-price"] && (
                <span className="old-price">{book["old-price"]}VND</span>
              )}
              <span className="new-price">{book["new-price"]}VND</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
