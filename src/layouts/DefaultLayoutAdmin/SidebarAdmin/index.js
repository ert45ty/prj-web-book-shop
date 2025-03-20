import React from "react";
import { NavLink } from "react-router-dom";

const SidebarAdmin = ({ logout }) => {
  return (
    <div className="ec-left-sidebar ec-bg-sidebar">
      <div id="sidebar" className="sidebar ec-sidebar-footer">
        <div className="ec-brand">
          <NavLink title="Book store" to={"/admin"}>
            <img
              className="ec-brand-icon"
              src="assets/img/logo/ec-site-logo.png"
              alt=""
            />
            <span className="ec-brand-name text-truncate">Book Store</span>
          </NavLink>
        </div>
        <div className="ec-navigation">
          <ul className="nav sidebar-inner" id="sidebar-menu">
            <li>
              <NavLink className="sidenav-item-link" to={"/admin"}>
                <i className="mdi mdi-view-dashboard-outline" />
                <span className="nav-text">Dashboard</span>
              </NavLink>
              <hr />
            </li>
            <li>
              <NavLink className="sidenav-item-link" to="/admin/users">
                <i className="mdi mdi-account-group" />
                <span className="nav-text">Users</span>
              </NavLink>
              <hr />
            </li>
            <li>
              <NavLink className="sidenav-item-link " to={"/admin/books"}>
                <i className="mdi mdi-palette-advanced" />
                <span className="nav-text">Books</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="sidenav-item-link" to={"/admin/orders"}>
                <i className="mdi mdi-cart" />
                <span className="nav-text">New Order</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                className="sidenav-item-link"
                to={"/admin/history-orders"}
              >
                <i className="mdi mdi-tag-faces" />
                <span className="nav-text">Order History</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="sidenav-item-link" to={"/admin/reviews"}>
                <i className="mdi mdi-star-half" />
                <span className="nav-text">Reviews</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="sidenav-item-link" to={"/"}>
                <i className="mdi mdi-image-filter-none" />
                <span className="nav-text">Go to website</span>
              </NavLink>
              <hr />
            </li>
            <li>
              <NavLink
                className="sidenav-item-link"
                type="button"
                onClick={() => logout()}
              >
                <i className="mdi mdi-logout" />
                <span className="nav-text">Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
