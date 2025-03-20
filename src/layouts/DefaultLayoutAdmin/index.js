import React from "react";
import SidebarAdmin from "./SidebarAdmin";
import FooterAdmin from "./FooterAdmin";
import { useAuth } from "../../context/AuthContext";

const DefaultLayoutAdmin = (props) => {
  const { logout } = useAuth();
  return (
    <div
      className="ec-header-fixed ec-sidebar-fixed ec-sidebar-dark ec-header-light"
      id="body"
    >
      <div className="wrapper">
        <SidebarAdmin logout={logout} />
        <div className="ec-page-wrapper">
          {props.children}
          <FooterAdmin />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayoutAdmin;
