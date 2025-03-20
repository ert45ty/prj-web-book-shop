import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import StarRating from "../../../components/StarRating";

const ReviewManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reviews");
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Fail to get reviews", error);
      setNotification({
        show: true,
        message: "Cannot get the reviews. Please try again.",
        type: "danger",
      });
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm("Are you sure to delete this review?")) {
      try {
        await api.delete(`/reviews/${reviewId}`);

        setReviews(reviews.filter((review) => review.id !== reviewId));

        setNotification({
          show: true,
          message: "Deleted Successfully!",
          type: "success",
        });

        // Tự động ẩn thông báo sau 2 giây
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 2000);
      } catch (error) {
        console.error("Fail to delete review", error);
        setNotification({
          show: true,
          message: "Cannot delete this review. Please try again.",
          type: "danger",
        });
      }
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Định dạng ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Review Management</h1>

      {/* Hiển thị thông báo */}
      {notification.show && (
        <div
          className={`alert alert-${notification.type} alert-dismissible fade show`}
          role="alert"
        >
          {notification.message}
          <button
            type="button"
            className="btn-close"
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
          ></button>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Total reviews</h5>
                  <p className="card-text display-4">{reviews.length}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Positive review (4-5 stars)</h5>
                  <p className="card-text display-4">
                    {reviews.filter((review) => review.rating >= 4).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <h5 className="card-title">Negative review (1-3 stars)</h5>
                  <p className="card-text display-4">
                    {reviews.filter((review) => review.rating < 4).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng danh sách đánh giá */}
          <div className="card shadow">
            <div className="card-header bg-light">
              <h5 className="mb-0">Reviews List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table">
                    <tr>
                      <th>ID</th>
                      <th>Book</th>
                      <th>User</th>
                      <th>Review</th>
                      <th>Comment</th>
                      <th>Created at</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReviews.length > 0 ? (
                      currentReviews.map((review) => (
                        <tr key={review.id}>
                          <td>{review.id}</td>
                          <td>{review.bookTitle}</td>
                          <td>{review.user_name}</td>
                          <td>
                            <StarRating
                              value={parseFloat(review.rating)}
                              readOnly={true}
                              size="small"
                            />
                          </td>
                          <td>{review.comment}</td>
                          <td>{formatDate(review.date)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteReview(review.id)}
                            >
                              <i className="bi bi-trash"></i> Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          Have no review
                        </td>
                      </tr>
                    )}
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewManagement;
