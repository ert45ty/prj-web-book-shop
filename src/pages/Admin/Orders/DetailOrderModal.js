import React from "react";

const DetailOrder = ({
  showDetailModal,
  selectedOrder,
  setShowDetailModal,
}) => {
  return (
    <div
      className={`modal fade ${showDetailModal ? "show" : ""}`}
      style={{ display: showDetailModal ? "block" : "none" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order detail #{selectedOrder.id}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowDetailModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <h6>User information</h6>
                <p>
                  <strong>Name:</strong> {selectedOrder.user.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.user.email}
                </p>
                <p>
                  <strong>Phone number:</strong>{" "}
                  {selectedOrder.user.phone || "N/A"}
                </p>
              </div>
              <div className="col-md-6">
                <h6>Order information</h6>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(selectedOrder.date).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      selectedOrder.status === "cancelled"
                        ? "bg-danger"
                        : selectedOrder.status === "shipping"
                        ? "text-primary"
                        : selectedOrder.status === "pending"
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
                <p>
                  <strong>Total:</strong> {selectedOrder.total}
                </p>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-3">
                <h6>Order address</h6>
                <p>{selectedOrder.orderAddress}</p>
              </div>
              <div className="col-md-3">
                <h6>Payment Method</h6>
                <p>{selectedOrder.paymentMethod}</p>
              </div>
              <div className="col-md-3">
                <h6>Payment Status</h6>
                <p
                  className={`badge ${
                    selectedOrder.paymentStatus === "cancelled"
                      ? "bg-danger"
                      : selectedOrder.paymentStatus === "unpaid"
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                >
                  {selectedOrder.paymentStatus}
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h6>List books</h6>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Books</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  item.image || "https://via.placeholder.com/50"
                                }
                                alt={item.title}
                                style={{
                                  width: "50px",
                                  height: "60px",
                                  marginRight: "10px",
                                }}
                              />
                              <div>
                                <p className="mb-0">{item.title}</p>
                                <small className="text-muted">
                                  ID: {item.id}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>{item["new-price"]}</td>
                          <td>{item.quantity}</td>
                          <td>{item["new-price"] * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end">
                          <strong>Total:</strong>
                        </td>
                        <td>
                          <strong>{selectedOrder.total}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* <div className="row mt-4">
              <div className="col-md-12">
                <h6>Lịch sử đơn hàng</h6>
                <ul className="list-group">
                  {selectedOrder.orderHistory &&
                    selectedOrder.orderHistory.map((history, index) => (
                      <li key={index} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span
                              className={`badge bg-${
                                history.status === "completed"
                                  ? "success"
                                  : history.status === "processing"
                                  ? "warning"
                                  : history.status === "pending"
                                  ? "secondary"
                                  : "info"
                              } me-2`}
                            >
                              {history.status}
                            </span>
                            {history.note}
                          </div>
                          <small>{formatDate(history.date)}</small>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div> */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowDetailModal(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              Print order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
