import React, { useEffect, useState } from "react";
import Product from "../../components/Product";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Home = () => {
  const [books, setBooks] = useState([]);
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books?_limit=8");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books: ", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <section
        className="section ec-product-tab section-space-p"
        id="collection"
      >
        <div className="container">
          <div className="row">
            <div className="ec-shop-rightside col-lg-12 col-md-12">
              <div className="col-md-12 text-center">
                <div className="section-title">
                  <h2 className="ec-bg-title">Our Top Collection</h2>
                  <h2 className="ec-title">Our Top Collection</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="shop-pro-content">
                <div className="shop-pro-inner">
                  <div className="row">
                    {books.map((book) => (
                      <Product key={book.id} book={book} />
                    ))}
                  </div>
                  <div className="col-sm-12 shop-all-btn">
                    <Link to="/books">Shop All Collection</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
