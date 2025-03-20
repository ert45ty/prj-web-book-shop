import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../services/api";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Cannot find order");
        setIsLoading(false);
        return;
      }

      try {
        const userId = localStorage.getItem("userId");
        const response = await api.get(
          `/orders?id=${orderId}&user.id=${userId}`
        );

        if (response.status !== 200) {
          throw new Error("Cannot fetching order information");
        }
        console.log(order);
        setOrder(response.data[0]);
        console.log(order);
      } catch (error) {
        console.error("Fetching order information fail: ", error);
        setError("Fetching order information fail. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getPaymentMethodName = (method) => {
    switch (method) {
      case "COD":
        return "Cash on Delivery (COD)";
      case "internetBanking":
        return "Internet Banking";
      default:
        return "Not determined";
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return { name: "Pending", color: "warning" };
      case "shipping":
        return { name: "Shiping", color: "info" };
      case "completed":
        return { name: "Delivered", color: "success" };
      case "cancelled":
        return { name: "Cancelled", color: "danger" };
      default:
        return { name: "Not determined", color: "secondary" };
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading order information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <hr />
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Order not found!</h4>
          <p>
            The order with ID: {orderId} does not exist or has been deleted.
          </p>
          <hr />
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="alert alert-success mb-4" role="alert">
            <h4 className="alert-heading">Order successfully!</h4>
            <p>
              Thank you for placing your order. Your order has been received and
              is being processed.
            </p>
            <p className="mb-0">
              Your order ID: <strong>{order.id}</strong>
            </p>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-white">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Order detail #{order.id}</h5>
                </div>
                <div className="col-md-6 text-md-end">
                  <span className={`badge bg-${statusInfo.color}`}>
                    {statusInfo.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="text-muted">Order information</h6>
                  <p className="mb-1">
                    <strong>Order date:</strong>{" "}
                    {new Date(order.date).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="mb-1">
                    <strong>Payment method:</strong>{" "}
                    {getPaymentMethodName(order.paymentMethod)}
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong>{" "}
                    <span className={`text-${statusInfo.color}`}>
                      {statusInfo.name}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Recipient information</h6>
                  <p className="mb-1">
                    <strong>Name:</strong> {order.user.name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {order.user.email}
                  </p>
                  <p className="mb-1">
                    <strong>Phone number:</strong> {order.user.phone}
                  </p>
                  <p className="mb-0">
                    <strong>Address:</strong> {order.orderAddress}
                  </p>
                </div>
              </div>

              <h6 className="text-muted mb-3">Products List</h6>
              <div className="table-responsive">
                <table className="table table-borderless">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Amount</th>
                      <th className="text-end">Unit price</th>
                      <th className="text-end">Total price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="img-thumbnail me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <p className="mb-0 fw-semibold">{item.title}</p>
                              {item.author && (
                                <small className="text-muted">
                                  {item.author}
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">{item["new-price"]} VND</td>
                        <td className="text-end">
                          {item["new-price"] * item.quantity} VND
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end">
                        <strong>Subtotal:</strong>
                      </td>
                      <td className="text-end">{order.total} VND</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end">
                        <strong>Delivery fee:</strong>
                      </td>
                      <td className="text-end">Free</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end">
                        <strong>Total price:</strong>
                      </td>
                      <td className="text-end fw-bold">{order.total} VND</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Next step</h5>
              <ol className="ps-3">
                <li className="mb-2">
                  We will confirm your order via email within 24 hours.
                </li>
                <li className="mb-2">
                  You will receive a notification when your order starts
                  shipping.
                </li>
                <li className="mb-2">
                  Estimated delivery time is 3-5 business days depending on the
                  area.
                </li>
                {order.paymentMethod === "COD" && (
                  <li>
                    Please prepare {order.total} VND when receiving the goods.
                  </li>
                )}
              </ol>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Support</h5>
              <p>
                If you have any questions about your order, please contact us
                via:
              </p>
              <ul className="ps-3">
                <li>
                  Email:{" "}
                  <a href="mailto:tannx45@gmail.com">tannx45@gmail.com</a>
                </li>
                <li>
                  Hotline: <strong>0983774025</strong> (8:00 - 22:00)
                </li>
              </ul>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-1"></i> Countinue shopping
            </Link>
            <Link to="/my-orders" className="btn btn-primary">
              View my order <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
