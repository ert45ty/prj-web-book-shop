import React from "react";

const DeleteOrderModal = ({
  showDeleteModal,
  selectedOrder,
  setShowDeleteModal,
  deleteOrder,
}) => {
  return (
    <div
      className={`modal fade ${showDeleteModal ? "show" : ""}`}
      style={{ display: showDeleteModal ? "block" : "none" }}
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm delete order</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowDeleteModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure to delete order #{selectedOrder.id} of user{" "}
              {selectedOrder.customerName}?
            </p>
            <p className="text-danger">Notice: This action cannot undo</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteOrder}
            >
              Delete order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrderModal;
