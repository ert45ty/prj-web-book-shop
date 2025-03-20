import React, { useState } from "react";
import api from "../../services/api";
import Sidebar from "./Sidebar";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [validated, setValidated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        text: "Confirm password does not match",
        type: "danger",
      });
      return false;
    }

    // Kiểm tra độ dài mật khẩu mới
    if (formData.newPassword.length < 6) {
      setMessage({
        text: "New password must be at least 6 characters",
        type: "danger",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const userId = localStorage.getItem("userId");
      // Lấy thông tin người dùng hiện tại
      const response = await api.get(`/users/${userId}`);
      const user = response.data;

      if (user.password !== formData.currentPassword) {
        setMessage({
          text: "Current password is invalid",
          type: "danger",
        });
        setLoading(false);
        return;
      }

      // Cập nhật mật khẩu mới
      await api.patch(`/users/${userId}`, {
        password: formData.newPassword,
      });

      setMessage({
        text: "Change password successfully!",
        type: "success",
      });

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setValidated(false);
    } catch (error) {
      console.error("Change password fail:", error);
      setMessage({
        text: "Change password fail. Please try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ec-page-content ec-vendor-uploads ec-user-account section-space-p">
      <div className="container mt-5">
        <div className="row">
          <Sidebar />
          <div className="ec-shop-rightside col-lg-9 col-md-12">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Change password</h3>
                  </div>
                  <div className="card-body">
                    {message.text && (
                      <div
                        className={`alert alert-${message.type}`}
                        role="alert"
                      >
                        {message.text}
                      </div>
                    )}

                    <form
                      noValidate
                      validated={validated.toString()}
                      onSubmit={handleSubmit}
                    >
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">
                          Current password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Please type your current password
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                          New password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                          minLength={6}
                        />
                        <div className="invalid-feedback">
                          New password must be at least 6 characters.
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Please confirm new password.
                        </div>
                      </div>

                      <div className="d-grid">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Loading...
                            </>
                          ) : (
                            "Change password"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
