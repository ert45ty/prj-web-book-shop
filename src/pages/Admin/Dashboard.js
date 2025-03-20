import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { getBooks } from "../../services/bookService";
import { getUsers } from "../../services/userService";
import { Link } from "react-router-dom";
import DetailOrder from "./Orders/DetailOrderModal";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [topBooks, setTopBooks] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchDatas = async () => {
    try {
      const booksData = await getBooks();
      const responseOrders = await api.get("/orders");
      const responseUser = await getUsers();
      const total = responseOrders.data.reduce(
        (sum, order) => sum + order.total,
        0
      );
      setStats({
        totalBooks: booksData.length,
        totalOrders: responseOrders.data.length,
        totalRevenue: total,
        totalUsers: responseUser.length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books?sold_gt=0&_sort=-sold&_limit=5");
      setTopBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders?_sort=-date&_limit=5");
      setRecentOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchDatas();
    fetchBooks();
    fetchOrders();
  }, []);

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  return (
    <div className="container-fluid p-0">
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-4 mb-4 mx-auto">
        <div className="col-xl-3 col-md-6">
          <div className="card card-dashboard border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total books</h6>
                  <h3>{stats.totalBooks}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="fas fa-book fa-2x text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card card-dashboard border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total orders</h6>
                  <h3>{stats.totalOrders}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="fas fa-shopping-cart fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card card-dashboard border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Revenue</h6>
                  <h3>
                    {(stats.totalRevenue / 1000000).toFixed(3)} milion VND
                  </h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="fas fa-money-bill-wave fa-2x text-info"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card card-dashboard border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total users</h6>
                  <h3>{stats.totalUsers}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-users fa-2x text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mx-auto">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Latest orders</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user.name}</td>
                        <td>{order.date}</td>
                        <td>
                          <span
                            className={`badge ${
                              order.status === "completed"
                                ? "bg-success"
                                : order.status === "Đang giao"
                                ? "bg-primary"
                                : order.status === "Chờ xác nhận"
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.total} VND</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => viewOrderDetail(order)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-white">
              <Link to={"/admin/orders"} className="text-decoration-none">
                See all orders <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
        {selectedOrder && (
          <DetailOrder
            selectedOrder={selectedOrder}
            setShowDetailModal={setShowDetailModal}
            showDetailModal={showDetailModal}
          />
        )}

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Best seller</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {topBooks.map((book) => (
                  <li
                    key={book.id}
                    className="list-group-item d-flex align-items-center p-3"
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="book-image me-3 rounded"
                      width={"50px"}
                      height={"70px"}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{book.title}</h6>
                      <small className="text-muted">{book.author}</small>
                    </div>
                    <span className="badge bg-success rounded-pill">
                      Sold {book.sold}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer bg-white">
              <Link to={"/admin/books"} className="text-decoration-none">
                See all book <i className="fas fa-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
