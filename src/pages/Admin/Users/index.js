import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../../services/userService";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import AddUser from "./AddUser";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    name: "",
    role: "ADMIN",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        alert("Deleted successfully!");
      } catch (err) {
        alert("Cannot delete. Try again.");
        console.error("Error deleting user:", err);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const validateForm = () => {
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.name ||
      !newUser.password ||
      !newUser.address ||
      !newUser.phone
    ) {
      setError("All fields are required except for status");
      return false;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!newUser.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!/^[0-9]{10}$/.test(newUser.phone)) {
      setError("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userToCreate = newUser;
      delete userToCreate.confirmPassword;

      await api.post("/users", userToCreate);

      // Refresh the user list
      await fetchUsers();

      setShowModal(false);
      setNewUser({
        username: "",
        email: "",
        name: "",
        role: "ADMIN",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
      });
      setError("");
    } catch (err) {
      setError("Failed to create user. Please try again.");
      console.error("Error creating user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New User
        </button>
        <div className="search-bar col-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search for user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone number</th>
                <th>Role</th>

                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "ADMIN" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Link
                          className="btn btn-sm btn-info me-2 d-flex align-items-center"
                          to={`/admin/users/${user.id}`}
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    Have no user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
      <AddUser
        setShowModal={setShowModal}
        showModal={showModal}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        newUser={newUser}
        loading={loading}
      />
    </div>
  );
};

export default UserList;
