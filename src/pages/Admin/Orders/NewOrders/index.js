import React, { useEffect, useState } from "react";
import api from "../../../../services/api";
import DetailOrder from "../DetailOrderModal";
import DeleteOrderModal from "../DeleteOrderModal";

const NewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusOptions] = useState([
    "cancelled",
    "pending",
    "shipping",
    "completed",
  ]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders?status_ne=completed");
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Cannot fetching orders. Please try again.");
      setLoading(false);
      console.error("Error fetching orders:", err);
    }
  };

  const updateOrderStatus = async (order, orderId, newStatus) => {
    try {
      setLoading(true);
      await api.put(`/orders/${orderId}`, { ...order, status: newStatus });

      // Cập nhật danh sách đơn hàng
      setOrders(
        orders.map((order) => {
          if (order.id === orderId) {
            return { ...order, status: newStatus };
          }
          return order;
        })
      );
      setLoading(false);
      alert("Update status successfully!");
    } catch (err) {
      setError("Cannot update status. Please try again.");
      setLoading(false);
      console.error("Error updating order status:", err);
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

  const filteredOrders = orders.filter((order) =>
    order.status.toString().includes(searchTerm)
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

  // Lấy danh sách đơn hàng khi component được mount

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Order Management</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="row mb-4 d-flex justify-content-center">
            <div className="col-md-3 ec-sort-select border">
              <span className="sort-by">Sort by</span>
              <div className="ec-select-inner">
                <select
                  name="ec-select"
                  id="ec-select"
                  onChange={(e) => setSearchTerm(e.target.value)}
                >
                  <option disabled selected>
                    Status
                  </option>
                  {statusOptions
                    .filter((option) => option !== "completed")
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo ID, tên khách hàng hoặc email..."
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
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Order List</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Order Date</th>
                    <th>Total price</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.user.name}</td>
                        <td>
                          {new Date(order.date).toLocaleDateString("vi-VN")}
                        </td>
                        <td>{order.total}</td>
                        <td>
                          <select
                            className={`form-select form-select-sm ${
                              order.status === "cancelled"
                                ? "text-danger"
                                : order.status === "shipping"
                                ? "text-primary"
                                : "text-warning"
                            }`}
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order, order.id, e.target.value)
                            }
                          >
                            {statusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{order.paymentMethod}</td>
                        <td>
                          <span
                            className={`badge ${
                              order.paymentStatus === "cancelled"
                                ? "text-danger"
                                : order.paymentStatus === "unpaid"
                                ? "text-warning"
                                : "text-success"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
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
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Have no order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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

export default NewOrders;
