import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import api from "../../services/api";
import DetailOrder from "../Admin/Orders/DetailOrderModal";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await api.get(`/orders?user.id=${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Cannot fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
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
    <section className="ec-page-content ec-vendor-uploads ec-user-account section-space-p">
      <div className="container">
        <div className="row">
          <Sidebar />
          <div className="ec-shop-rightside col-lg-9 col-md-12">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">My order history</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Order date</th>
                        <th>Total price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="order-row"
                          onClick={() => viewOrderDetail(order)}
                        >
                          <td>#{order.id}</td>
                          <td>
                            {new Date(order.date).toLocaleDateString("vi-VN")}
                          </td>
                          <td>{order.total}đ</td>
                          <td>
                            <span
                              className={`badge ${
                                order.status === "cancelled"
                                  ? "text-danger"
                                  : order.status === "shipping"
                                  ? "text-primary"
                                  : order.status === "pending"
                                  ? "text-warning"
                                  : "text-success"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderHistory;
