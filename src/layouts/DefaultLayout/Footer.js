import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="ec-footer section-space-mt">
      <div className="footer-container">
        <div className="footer-top section-space-footer-p">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-lg-4 ec-footer-contact">
                <div className="ec-footer-widget">
                  <div className="ec-footer-logo">
                    <a href="/">
                      <img src="assets/images/logo/footer-logo.png" alt="" />
                      <img
                        className="dark-footer-logo"
                        src="assets/images/logo/dark-logo.png"
                        alt="Site Logo"
                        style={{ display: "none" }}
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-lg-4 ec-footer-account">
                <div className="ec-footer-widget">
                  <h4 className="ec-footer-heading">Contact us</h4>
                  <div className="ec-footer-links">
                    <ul className="align-items-center">
                      <li className="ec-footer-link">Hà Nội</li>
                      <li className="ec-footer-link">
                        <span>Call Us:</span>
                        <a href="#">0987654321</a>
                      </li>
                      <li className="ec-footer-link">
                        <span>Email:</span>
                        <a href="mailto:tannx45@gmail.com">tannx45@gmail.com</a>
                      </li>
                      {/* <li className="ec-footer-link">
                        <a href="contact-us.html">Contact us</a>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-lg-4 ec-footer-account">
                <div className="ec-footer-widget">
                  <h4 className="ec-footer-heading">Account</h4>
                  <div className="ec-footer-links">
                    <ul className="align-items-center">
                      <li className="ec-footer-link">
                        <Link to={"/profile"}>My Account</Link>
                      </li>
                      <li className="ec-footer-link">
                        <Link to={"/order-history"}>Order History</Link>
                      </li>
                      <li className="ec-footer-link">
                        <Link to={"/wishlist"}>Wish List</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col text-center footer-copy">
              <div className="footer-bottom-copy ">
                <div className="ec-copy">
                  Copyright © 2023-2024{" "}
                  <a className="site-name text-upper" href="/">
                    BOOK STORE<span>.</span>
                  </a>
                  . All Rights Reserved
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
