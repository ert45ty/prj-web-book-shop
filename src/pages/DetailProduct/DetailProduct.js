import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import StarRating from "../../components/StarRating";
import { getBookById } from "../../services/bookService";

const DetailProduct = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [relatedBooks, setRelatedBooks] = useState([]);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDetailProducts = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(id);
        setBook(bookData);

        // Lấy đánh giá cho sách
        const reviewsData = await api.get(`/reviews?bookId=${id}`);
        setReviews(reviewsData.data);

        // Lấy sách liên quan (cùng cate)
        if (true) {
          const relatedBooksData = await api.get(
            `/books?category=${bookData.category}&_limit=4&id_ne=${id}`
          );
          setRelatedBooks(relatedBooksData.data);
        }

        setLoading(false);
      } catch (err) {
        setError("Error fetching book details. Please try again");
        setLoading(false);
        console.error("Error fetching book details:", err);
      }
    };

    fetchDetailProducts();
  }, [id]);

  // Xử lý gửi đánh giá mới
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to review");
      return;
    }

    try {
      const reviewData = {
        book_id: id,
        user_id: user.id,
        bookTitle: book.title,
        user_name: user.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString(),
      };

      const response = await api.post("/reviews", reviewData);

      // Cập nhật danh sách đánh giá
      setReviews([...reviews, response.data]);

      // Cập nhật số lượng đánh giá và điểm đánh giá trung bình của sách
      const newRatingCount = book.rating_count + 1;
      const newRating =
        (book.rating * book.rating_count + newReview.rating) / newRatingCount;

      await api.patch(`/books/${id}`, {
        rating: newRating.toFixed(1),
        rating_count: newRatingCount,
      });

      setBook({
        ...book,
        rating: newRating.toFixed(1),
        rating_count: newRatingCount,
      });

      // Reset form
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Error submitting review. Please try again.");
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  if (error) return <div className="alert alert-danger my-5">{error}</div>;
  if (!book)
    return <div className="alert alert-warning my-5">Không tìm thấy sách</div>;

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/books">Books</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {book.title}
          </li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <img
              src={book.image}
              className="card-img-top img-fluid"
              alt={book.title}
            />
            {book.discountPercent > 0 && (
              <div className="position-absolute top-0 end-0 bg-danger text-white p-2">
                -{book.discountPercent}%
              </div>
            )}
          </div>
        </div>

        <div className="col-md-8">
          <h1 className="mb-3">{book.title}</h1>

          <div className="d-flex align-items-center mb-3">
            <StarRating value={parseFloat(book.rating)} readOnly={true} />
            <span className="ms-2">({book.rating_count} reviews)</span>
          </div>

          {book["old-price"] && (
            <p className="text-muted text-decoration-line-through">
              {book["old-price"].toLocaleString()}đ
            </p>
          )}
          <p className="fs-2 text-danger fw-bold mb-3">
            {book["new-price"].toLocaleString()}đ
          </p>

          <div className="mb-3">
            <span
              className={`badge ${
                book.stock > 0 ? "bg-success" : "bg-danger"
              } me-2`}
            >
              {book.stock > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
            {book.stock > 0 && (
              <small className="text-muted">Stock: {book.stock} books</small>
            )}
          </div>

          <div className="d-flex mb-4">
            <button
              className="btn btn-primary me-2"
              onClick={() => addToCart(book)}
              disabled={book.stock <= 0}
            >
              <i className="bi bi-cart-plus"></i> Add to cart
            </button>

            <button
              className={`btn ${
                isInWishlist(book.id) ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={toggleWishlist}
            >
              <img
                src="assets/images/icons/wishlist.svg"
                className="svg_img pro_svg"
                alt=""
              />
            </button>
          </div>

          <div className="mb-4">
            <h5>Information: </h5>
            <table className="table">
              <tbody>
                <tr>
                  <th scope="row">Author</th>
                  <td>{book.author}</td>
                </tr>
                <tr>
                  <th scope="row">Category</th>
                  <td>{book.category}</td>
                </tr>
                <tr>
                  <th scope="row">Sold </th>
                  <td>{book.sold} books</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Description</h3>
            </div>
            <div className="card-body">
              <p>{book.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>Reviews</h3>
              <span className="badge bg-primary">{reviews.length} reviews</span>
            </div>
            <div className="card-body">
              {/* Danh sách đánh giá */}
              {reviews.length > 0 ? (
                <div className="mb-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="mb-4 pb-4 border-bottom">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5>{review.user_name}</h5>
                          <StarRating value={review.rating} readOnly={true} />
                        </div>
                        <small className="text-muted">
                          {new Date(review.date).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No review for this book</p>
              )}

              {/* Form đánh giá */}
              <div className="mt-4">
                <h4>Leave your review here</h4>
                {user ? (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="form-label mb-2 mt-2">
                        Your review
                      </label>
                      <div className="mb-3">
                        <StarRating
                          value={newReview.rating}
                          onChange={(value) =>
                            setNewReview({ ...newReview, rating: value })
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <textarea
                        id="reviewComment"
                        className="form-control"
                        rows="4"
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
                  </form>
                ) : (
                  <div className="alert alert-info">
                    Please <Link to="/login">login</Link> to leave your review
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedBooks.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="mb-4">Related books</h3>
            <div className="row">
              {relatedBooks.map((relatedBook) => (
                <div key={relatedBook.id} className="col-md-3 col-6 mb-4">
                  <div className="card h-100">
                    <Link to={`/books/${relatedBook.id}`}>
                      <img
                        src={relatedBook.image}
                        className="card-img-top"
                        alt={relatedBook.title}
                        width={"250px"}
                        height={"300px"}
                      />
                    </Link>
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link
                          to={`/books/${relatedBook.id}`}
                          className="text-decoration-none text-dark"
                        >
                          {relatedBook.title}
                        </Link>
                      </h5>
                      <div className="d-flex align-items-center mb-2">
                        <StarRating
                          value={parseFloat(relatedBook.rating)}
                          readOnly={true}
                          size="small"
                        />
                        <small className="ms-1">
                          ({relatedBook.rating_count})
                        </small>
                      </div>
                      <p className="card-text text-danger fw-bold">
                        {relatedBook["new-price"].toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduct;
