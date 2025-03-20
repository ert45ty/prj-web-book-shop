import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import api from "../../services/api";

const HotOffer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, updateSort] = useState("title");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(
          `/books?discountPercent_gt=0&_sort=${sort}`
        );
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [sort]);

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

  const handleSortChange = (event) => {
    updateSort(event.target.value);
  };

  return (
    <section className="ec-page-content section-space-p">
      <div className="container">
        <div className="row">
          <div className="ec-shop-rightside col-lg-12 col-md-12">
            <div className="ec-pro-list-top d-flex justify-content-end">
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
              <div className="col-md-6 ec-sort-select">
                <span className="sort-by">Sort by</span>
                <div className="ec-select-inner">
                  <select
                    name="ec-select"
                    id="ec-select"
                    onChange={handleSortChange}
                  >
                    <option disabled>Position</option>
                    <option value="title">Name, A to Z</option>
                    <option value="-title">Name, Z to A</option>
                    <option value="new-price">Price Low to high</option>
                    <option value="-new-price">Price high to low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="shop-pro-content">
              <div className="shop-pro-inner">
                <div className="row">
                  {currentBooks.map((book) => (
                    <Product key={book.id} book={book} />
                  ))}
                  ;
                </div>
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
        </div>
      </div>
    </section>
  );
};

export default HotOffer;
