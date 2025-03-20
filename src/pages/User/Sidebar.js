import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="ec-shop-leftside ec-vendor-sidebar col-lg-3 col-md-12">
      <div className="ec-sidebar-wrap">
        <div className="ec-sidebar-block">
          <div className="ec-vendor-block">
            <div className="ec-vendor-block-items">
              <ul>
                <li>
                  <NavLink to={"/profile"}>My Profile</NavLink>
                </li>
                <li>
                  <NavLink to={"/order-history"}>My Order History</NavLink>
                </li>
                <li>
                  <NavLink to={"/change-password"}>Change Password</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
