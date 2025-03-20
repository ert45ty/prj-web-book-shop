import React from "react";
import DefaultLayoutAdmin from "..";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <DefaultLayoutAdmin>
      <Outlet />
    </DefaultLayoutAdmin>
  );
};

export default Admin;
