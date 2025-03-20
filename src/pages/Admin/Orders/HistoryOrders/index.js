import React, { useEffect, useState } from "react";
import api from "../../../../services/api";
import DeleteOrderModal from "../DeleteOrderModal";
import DetailOrder from "../DetailOrderModal";

const HistoryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders?status=completed");
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching orders");
      setLoading(false);
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrder = async () => {
    try {
      await api.delete(`/orders/${selectedOrder.id}`);
      setOrders(orders.filter((order) => order.id !== selectedOrder.id));
      setShowDeleteModal(false);
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Error deleting order");
    }
  };

  const confirmDeleteOrder = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Fetching orders data...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-outline-danger ms-3" onClick={fetchOrders}>
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="container admin-container">
      <h1 className="mb-4">Order History Management</h1>
      <div className="row mb-4 d-flex justify-content-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by order ID, name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchOrders}>
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
      </div>

      <div className="alert alert-info">
        Total: <strong>{filteredOrders.length}</strong> orders completed
      </div>

      {currentOrders.length === 0 ? (
        <div className="alert alert-warning">Have no order.</div>
      ) : (
        <div className="row">
          {currentOrders.map((order) => (
            <div className="col-md-4" key={order.id}>
              <div className="card order-card">
                <div className="card-header bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Order ID #{order.id}</h5>
                    <span className="badge bg-success">{order.status}</span>
                  </div>
                </div>
                <div className="card-body">
                  <p>
                    <strong>User:</strong> {order.user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.user.email}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.date).toLocaleDateString("vi-VN")}
                  </p>
                  <p>
                    <strong>Total:</strong> {order.total}
                  </p>
                  <p>
                    <strong>Amount:</strong> {order.amount}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {order.paymentStatus}
                  </p>
                </div>
                <div className="card-footer bg-white">
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-info"
                      onClick={() => viewOrderDetail(order)}
                    >
                      <i className="bi bi-eye"></i> See detail
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => confirmDeleteOrder(order)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <li
                  key={number}
                  className={`page-item ${
                    currentPage === number ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                </li>
              )
            )}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      )}

      {selectedOrder && (
        <DetailOrder
          selectedOrder={selectedOrder}
          setShowDetailModal={setShowDetailModal}
          showDetailModal={showDetailModal}
        />
      )}
      {selectedOrder && (
        <DeleteOrderModal
          selectedOrder={selectedOrder}
          setShowDeleteModal={setShowDeleteModal}
          showDeleteModal={showDeleteModal}
          deleteOrder={deleteOrder}
        />
      )}
    </div>
  );
};

export default HistoryOrders;
