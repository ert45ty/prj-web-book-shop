import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState();

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id.replace("edit", "").toLowerCase()]: value,
    });
  };

  const updateUserProfile = async () => {
    try {
      setLoading(true);
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
      };

      await api.put(`/users/${currentUser.id}`, updatedUser);
      setCurrentUser(updatedUser);
      setShowModal(false);
      alert("Update information success!");
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("Unable to update information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      address: currentUser.address,
      phone: currentUser.phone,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const response = await api.get(`/users/${userId}`);
        const userData = response.data;
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error while retrieving user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <section className="ec-page-content ec-vendor-uploads ec-user-account section-space-p">
      <div className="container mt-5">
        <div className="row">
          <Sidebar />
          {currentUser ? (
            <div className="ec-shop-rightside col-lg-9 col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h2>My information</h2>
                    <button
                      className="btn btn-primary mb-3"
                      onClick={openModal}
                      disabled={loading}
                    >
                      Edit <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3>
                        <strong>Name:</strong> {currentUser.name}
                      </h3>
                      <h3>
                        <strong>Email:</strong> {currentUser.email}
                      </h3>
                      <h3>
                        <strong>Address:</strong> {currentUser.address}
                      </h3>
                      <h3>
                        <strong>Phone number:</strong> {currentUser.phone}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading user information...</p>
            </div>
          )}

          {showModal && (
            <div
              className={`modal fade ${showModal ? "show" : ""}`}
              style={{ display: showModal ? "block" : "none" }}
              id="editProfileModal"
              tabIndex="-1"
              aria-labelledby="editProfileModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="editProfileModalLabel">
                      Update Information
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModal}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form id="editProfileForm">
                      <div className="mb-3">
                        <label htmlFor="editName" className="form-label">
                          Họ tên
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="editName"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="editEmail" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="editEmail"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="editAddress" className="form-label">
                          Địa chỉ
                        </label>
                        <textarea
                          className="form-control"
                          id="editAddress"
                          rows="2"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="editPhone" className="form-label">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="editPhone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={updateUserProfile}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
