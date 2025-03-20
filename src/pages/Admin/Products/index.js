import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBooks, deleteBook } from "../../../services/bookService";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await getBooks();
      setBooks(response);
      setError(null);
    } catch (err) {
      setError("Cannot get list books. Please try again.");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this book?")) {
      try {
        await deleteBook(id);
        setBooks(books.filter((book) => book.id !== id));
        alert("Deleted successfully!");
      } catch (err) {
        alert("Cannot delete. Try again.");
        console.error("Error deleting book:", err);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Books Management</h2>
        <Link to="/admin/books/create" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Add new book
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by book title, author, category..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="btn btn-outline-secondary" type="button">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
            <div className="col-md-6 text-end">
              <button
                className="btn btn-outline-secondary"
                onClick={fetchBooks}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" width="5%">
                        ID
                      </th>
                      <th scope="col" width="15%">
                        Image
                      </th>
                      <th scope="col" width="20%">
                        Title
                      </th>
                      <th scope="col" width="10%">
                        Author
                      </th>
                      <th scope="col" width="10%">
                        Category
                      </th>
                      <th scope="col" width="10%">
                        Price (VNĐ)
                      </th>
                      <th scope="col" width="10%">
                        Stock
                      </th>
                      <th scope="col" width="10%">
                        Discount
                      </th>
                      <th scope="col" width="10%">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBooks.length > 0 ? (
                      currentBooks.map((book) => (
                        <tr key={book.id}>
                          <td>{book.id}</td>
                          <td>
                            <img
                              src={book.image || "/placeholder-book.png"}
                              alt={book.title}
                              className="img-thumbnail"
                              style={{
                                width: "80px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>
                            <p className="fw-semibold mb-0">{book.title}</p>
                          </td>
                          <td>{book.author}</td>
                          <td>
                            <span className="badge bg-info">
                              {book.category}
                            </span>
                          </td>
                          <td>{book["new-price"]} VND</td>
                          <td>
                            <span
                              className={`badge ${
                                book.stock > 10
                                  ? "bg-success"
                                  : book.stock > 0
                                  ? "bg-warning"
                                  : "bg-danger"
                              }`}
                            >
                              {book.stock}
                            </span>
                          </td>
                          <td>{book.discountPercent}%</td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/admin/books/${book.id}`}
                                className="btn btn-sm btn-outline-success d-flex align-items-center"
                                title="Detail"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              <Link
                                to={`/admin/books/update/${book.id}`}
                                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                title="Update"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                onClick={() => handleDelete(book.id)}
                                title="Xóa"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <p className="text-muted mb-0">
                            Không tìm thấy sách nào
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookManagement;
