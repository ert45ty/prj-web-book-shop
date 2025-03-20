import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Checkout from "../Checkout/Checkout";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, setCartItems } =
    useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });

    // Clear error when user edits the field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      removeFromCart(productId);
    } catch (err) {
      setError("Cannot remove book, please try again.");
    }
  };

  const handleUpdateQuantity = async (productId, quantity, stock) => {
    try {
      if (quantity > 0) {
        if (quantity > stock) {
          setError("Quantity cannot exceed stock");
          return;
        }
        await updateQuantity(productId, quantity);
      } else {
        handleRemoveItem(productId);
      }
    } catch (err) {
      setError("Cannot update quantity, please try again.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      setError("Cannot delete cart, please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item["new-price"] * item.quantity,
      0
    );
  };

  const calculateAmount = () => {
    return cartItems.reduce((amount, item) => amount + item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowModal(true);
  };

  // Handle modal closing
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = "Please type your name";
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = "Please type your email";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Please type your phone number";
    } else if (!/^\d{10,11}$/.test(customerInfo.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = "Please type your address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateStock = async () => {
    try {
      await Promise.all(
        cartItems.map(async (item) => {
          const itemResponse = await api.get(`/books/${item.id}`);
          const itemData = itemResponse.data;
          if (itemData.stock < item.quantity) {
            throw new Error(`Not enough stock for ${item.name}`);
          } else {
            const response = await api.patch(`/books/${item.id}`, {
              stock: item.stock - item.quantity,
              sold: item.sold + item.quantity,
            });
          }
        })
      );
    } catch (error) {
      console.error("Error updating stock and quantity", error);
      setError(error.message);
    }
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new order
      const order = {
        items: [...cartItems],
        user: {
          id: user.id,
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: user.address,
        },
        amount: calculateAmount(),
        total: calculateTotal(),
        orderAddress: customerInfo.address,
        date: new Date().toISOString(),
        status: "pending",
        paymentMethod: customerInfo.paymentMethod,
        paymentStatus: "unpaid",
      };
      updateStock();
      const response = await api.post("/orders", order);

      if (response.status !== 201) {
        console.log(response.status);
        throw new Error("Failed to create order");
      }

      handleClearCart();

      setShowModal(false);

      // Redirect based on payment method
      if (customerInfo.paymentMethod === "internetBanking") {
        window.location.href = `/qr-payment?orderId=${response.data.id}`;
      } else {
        window.location.href = `/order-confirmation?orderId=${response.data.id}`;
      }
    } catch (error) {
      console.error("Error while processing order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-cart3 fs-1"></i>
        <h3>Cart is empty</h3>
        <p className="mt-3 mb-3">You have no book in your cart</p>
        <Link to={"/"} className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="row mr-2 ml-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive col-md-8">
        <table className="table">
          <thead>
            <tr>
              <th>Books</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "60px", marginRight: "15px" }}
                    />
                    <div>
                      <h6>{item.title}</h6>
                      <small className="text-muted">
                        Author: {item.author}
                      </small>
                    </div>
                  </div>
                </td>
                <td>{item["new-price"]}VND</td>
                <td>
                  <div
                    className="input-group row d-flex align-items-stretch"
                    style={{ width: "120px" }}
                  >
                    <button
                      className="btn btn-outline-secondary col d-flex align-items-center justify-content-center"
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      className="form-control col text-center p-0"
                      type="text"
                      readOnly
                      value={item.quantity || 0}
                      style={{
                        border: "1px solid #ced4da",
                        height: "auto",
                        minHeight: "100%",
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary col d-flex align-items-center justify-content-center"
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id,
                          item.quantity + 1,
                          item.stock
                        )
                      }
                      disabled={item.stock == item.quantity}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  {item["new-price"] * item.quantity}
                  VND
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn btn-outline-danger mb-3"
          onClick={handleClearCart}
        >
          Delete cart
        </button>
      </div>

      <div className="row col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total cart</h5>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>{calculateTotal().toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Discount:</span>
              <span>0đ</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-2 fw-bold">
              <span>Total:</span>
              <span>{calculateTotal().toLocaleString("vi-VN")}đ</span>
            </div>
            <button
              className="btn btn-success w-100 mt-3"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <Checkout
          errors={errors}
          handleCloseModal={handleCloseModal}
          handleConfirmOrder={handleConfirmOrder}
          handleInputChange={handleInputChange}
          cartItems={cartItems}
          total={calculateTotal()}
          customerInfo={customerInfo}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default Cart;
