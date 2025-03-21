import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const QRPayment = () => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(600);
  const [timer, setTimer] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`/orders/${orderId}`);
        if (response.status !== 200) {
          throw new Error("Unable to load order information");
        }
        if (
          response.data.paymentStatus === "paid" ||
          response.data.paymentStatus === "cancelled"
        ) {
          navigate("/");
          return;
        }
        setOrder(response.data);
      } catch (error) {
        console.error("Fetching order information fail:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    const intervalId = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    setTimer(intervalId);

    return () => {
      if (timer) clearInterval(timer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleConfirmPayment = async () => {
    try {
      await api.patch(`/orders/${orderId}`, {
        paymentStatus: "paid",
      });
      setPaymentStatus("paid");

      setTimeout(() => {
        navigate(`/order-confirmation?orderId=${orderId}`, { replace: true });
      }, 5000);
    } catch (error) {
      console.error("Error while confirming payment:", error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await api.patch(`/orders/${orderId}`, {
        status: "cancelled",
        paymentStatus: "cancelled",
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error when canceling order:", error);
    }
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case "paid":
        return (
          <div className="alert alert-success text-center">
            <h4>Payment successful!</h4>
            <p>Thank you for your payment. Your order is being processed.</p>
            <p>Redirect...</p>
          </div>
        );
      case "pending":
      default:
        return (
          <div className="alert alert-info text-center">
            <h4>Wait for payment</h4>
            <p>Please complete payment within the time shown.</p>
            <p className="mb-0">
              Time remaining: <strong>{formatTime(countdown)}</strong>
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <h4>Order not found</h4>
          <p>The order does not exist or has been canceled..</p>
          <Link to={"/"} className="btn btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Order payment #{orderId}</h5>
            </div>
            <div className="card-body">
              {renderPaymentStatus()}

              <div className="row mt-4">
                <div className="col-md-6 text-center">
                  <h6>Scan QR code to pay</h6>
                  <div className="border p-3 mb-3">
                    <img
                      src="assets/img/QRcode.jpg"
                      alt="QR Code"
                      className="img-fluid"
                    />
                  </div>
                  <p className="small text-muted">
                    Use your banking app or e-wallet to scan the code
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Transfer information</h6>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>Account number</td>
                        <td>
                          <strong>0983774025</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Name of customer</td>
                        <td>
                          <strong>NGUYEN XUAN TAN</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Bank</td>
                        <td>
                          <strong>MBBANK</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Amount</td>
                        <td>
                          <strong>{order.total} VND</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Transfer content</td>
                        <td>
                          <strong>PAYMENT {orderId}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4">
                <h6>Order information</h6>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Amount</th>
                      <th className="text-end">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">
                          {item["new-price"] * item.quantity} VND
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2" className="text-end">
                        <strong>Total price:</strong>
                      </td>
                      <td className="text-end">
                        <strong>{order.total} VND</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-4 d-flex justify-content-between">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleCancelOrder}
                  disabled={paymentStatus === "paid" || countdown === 0}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleConfirmPayment}
                  disabled={paymentStatus === "paid" || countdown === 0}
                >
                  Paid
                </button>
              </div>

              {countdown === 0 && (
                <div className="alert alert-warning mt-3">
                  <h5>Payment time is up</h5>
                  <p>Payment time has expired. Please create a new order.</p>
                  <div className="text-center mt-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/")}
                    >
                      Back to home
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer">
              <div className="row">
                <div className="col-md-6">
                  <h6>Support:</h6>
                  <p className="mb-0">
                    <i className="bi bi-telephone"></i> Hotline:{" "}
                    <strong>0983774025</strong>
                  </p>
                  <p className="mb-0">
                    <i className="bi bi-envelope"></i> Email:{" "}
                    <strong>tannx45@gmail.com</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPayment;
