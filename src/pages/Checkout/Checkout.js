import React from "react";

const Checkout = ({
  handleCloseModal,
  handleInputChange,
  customerInfo,
  errors,
  cartItems,
  total,
  handleConfirmOrder,
  isSubmitting,
}) => {
  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Checkout</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Order information</h6>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <h6>Payment Method</h6>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="COD"
                    value="COD"
                    checked={customerInfo.paymentMethod === "COD"}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="COD">
                    Ship COD
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="internetBanking"
                    value="internetBanking"
                    checked={customerInfo.paymentMethod === "internetBanking"}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="internetBanking">
                    Internet Banking (QR)
                  </label>
                </div>
                <h6 className="mt-4">Order detail</h6>
                <div className="card">
                  <div className="card-body">
                    <div className="mb-3">
                      <h6>Items list</h6>
                      <ul className="list-group">
                        {cartItems.map((item) => (
                          <li
                            key={item.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <span>{item.title}</span>
                              <small className="d-block text-muted">
                                Quantity: {item.quantity}
                              </small>
                            </div>
                            <span>
                              {(
                                item["new-price"] * item.quantity
                              ).toLocaleString("vi-VN")}{" "}
                              VND
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>{total.toLocaleString("vi-VN")} VND</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Delivery fee:</span>
                      <span>Free</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total:</strong>
                      <strong>{total.toLocaleString("vi-VN")} VND</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processing...
                </>
              ) : (
                "Confirm order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
