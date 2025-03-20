import React from "react";
import { Link } from "react-router-dom";

const FooterAdmin = () => {
  return (
    <footer className="footer mt-auto">
      <div className="copyright bg-white">
        <p>
          Copyright © <span id="ec-year" />
          <Link className="text-primary" to={"/admin"}>
            {" "}
            BookStore Admin Dashboard
          </Link>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterAdmin;
