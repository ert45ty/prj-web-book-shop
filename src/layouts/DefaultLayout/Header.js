import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const checkLoginStatus = () => {
      if (isAuthenticated && user) {
        fetchUserData(user.id);
      }
    };

    const fetchUserData = async () => {
      try {
        setCartCount(cartItems.length);
        setWishlistCount(wishlistItems.length);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkLoginStatus();
    fetchUserData();
  }, [user, isAuthenticated, cartItems, wishlistItems]);

  const handleLogout = () => {
    logout();
    setCartCount(0);
    setWishlistCount(0);
    window.location.href = "/";
  };

  return (
    <header className="ec-header">
      <div className="ec-header-bottom d-none d-lg-block">
        <div className="container position-relative">
          <div className="row">
            <div className="ec-flex">
              <div className="align-self-center">
                <div className="header-logo">
                  <Link to={"/"}>
                    <img src="assets/images/logo/logo.png" alt="Site Logo" />
                    <img
                      className="dark-logo"
                      src="assets/images/logo/dark-logo.png"
                      alt="Site Logo"
                      style={{ display: "none" }}
                    />
                  </Link>
                </div>
              </div>
              <div className="align-self-center col-6">
                <div className="ec-main-menu">
                  <ul>
                    <li>
                      <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                      <NavLink to="books">Product</NavLink>
                    </li>
                    <li>
                      <NavLink to="hot-offers">Hot offers</NavLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="align-self-center">
                <div className="ec-header-bottons">
                  <Link
                    to={"/wishlist"}
                    className="ec-header-btn ec-header-wishlist"
                  >
                    <div className="header-icon">
                      <img
                        src="assets/images/icons/wishlist.svg"
                        className="svg_img header_svg"
                        alt=""
                      />
                    </div>
                    <span className="ec-header-count">{wishlistCount}</span>
                  </Link>
                  <Link to={"/cart"} className="ec-header-btn ec-side-toggle">
                    <div className="header-icon">
                      <img
                        src="assets/images/icons/cart.svg"
                        className="svg_img header_svg"
                        alt=""
                      />
                    </div>
                    <span className="ec-header-count cart-count-lable">
                      {cartCount}
                    </span>
                  </Link>
                  <div className="ec-header-user dropdown">
                    <button
                      className="dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <img
                        src="assets/images/icons/user.svg"
                        className="svg_img header_svg"
                        alt=""
                      />
                    </button>
                    {isAuthenticated && user ? (
                      <ul className="dropdown-menu dropdown-menu-right">
                        <li className="dropdown-item user-title">
                          <span>Hello, {user.name}</span>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            My account
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/order-history">
                            My order
                          </Link>
                        </li>
                        {user.role === "ADMIN" && (
                          <li>
                            <Link className="dropdown-item" to="/admin">
                              Admin
                            </Link>
                          </li>
                        )}

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    ) : (
                      <ul className="dropdown-menu dropdown-menu-right">
                        <li>
                          <Link className="dropdown-item" to="/register">
                            Register
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/login">
                            Login
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
