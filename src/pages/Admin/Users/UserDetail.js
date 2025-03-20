import React, { useState, useEffect } from "react";
import { deleteUser, getUserById } from "../../../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [userData, ordersData] = await Promise.all([
          getUserById(id),
          api.get(`/orders?userId=${id}`),
        ]);

        setUser(userData);
        setOrders(ordersData.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching user details or orders. Please try again");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await deleteUser(id);
        alert("Deleted successfully!");
        navigate("/admin/users");
      } catch (err) {
        alert("Cannot delete. Try again.");
        console.error("Error deleting user:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          Loading...
        </div>
      </div>
    );
  if (error) return <div className="alert alert-danger my-5">{error}</div>;
  if (!user)
    return <div className="alert alert-warning my-5">Cannot find user</div>;

  return (
    <div className="content">
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-sm btn-secondary me-2"
          onClick={() => navigate("/admin/users")}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h2 className="mb-0">User Detail</h2>
      </div>

      <div className="card user-detail-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Information</h5>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(user.id)}
          >
            <i className="bi bi-trash me-2"></i>Delete user
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-bold">ID:</label>
              <p>{user.id}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-bold">Username:</label>
              <p>{user.username}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-bold">Name:</label>
              <p>{user.name}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-bold">Email:</label>
              <p>{user.email}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-bold">Phone number:</label>
              <p>{user.phone}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-bold">Role:</label>
              <p>
                <span
                  className={`badge ${
                    user.role === "ADMIN" ? "bg-danger" : "bg-success"
                  }`}
                >
                  {user.role === "ADMIN" ? "Admin" : "User"}
                </span>
              </p>
            </div>
            <div className="col-md-12 mb-3">
              <label className="fw-bold">Address:</label>
              <p>{user.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card user-detail-card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Order History</h5>
        </div>
        <div className="card-body">
          {orders && orders.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order id</th>
                    <th>Order date</th>
                    <th>Total price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        {new Date(order.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td>{order.total}VND</td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === "Đã giao"
                              ? "bg-success"
                              : "bg-warning text-dark"
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
          ) : (
            <p className="text-center">This user have no order.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
