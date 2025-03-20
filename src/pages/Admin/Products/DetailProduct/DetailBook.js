import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StarRating from "../../../../components/StarRating";
import { getBookById } from "../../../../services/bookService";

const DetailBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailProducts = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(id);
        setBook(bookData);
        setLoading(false);
      } catch (err) {
        setError("Error fetching book details. Please try again");
        setLoading(false);
        console.error("Error fetching book details:", err);
      }
    };

    fetchDetailProducts();
  }, [id]);

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          Loading...
        </div>
      </div>
    );
  if (error) return <div className="alert alert-danger my-5">{error}</div>;
  if (!book)
    return <div className="alert alert-warning my-5">Cannot find book</div>;

  return (
    <div className="container my-5">
      <button
        type="button"
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/admin/books")}
        disabled={loading}
      >
        Go back
      </button>
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
    </div>
  );
};

export default DetailBook;
