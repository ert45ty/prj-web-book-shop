import { Routes, Route } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import Cart from "../pages/Cart/Cart";
import Home from "../pages/Home/Home";
import ListProduct from "../pages/ListProducts/ListProduct";
import Wishlist from "../pages/Wishlist/Wishlist";
import Profile from "../pages/User/Profile";
import OrderHistory from "../pages/User/OrderHistory";
import DetailProduct from "../pages/DetailProduct/DetailProduct";
import Dashboard from "../pages/Admin/Dashboard";
import NewOrders from "../pages/Admin/Orders/NewOrders";
import HistoryOrders from "../pages/Admin/Orders/HistoryOrders";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Admin from "../layouts/DefaultLayoutAdmin/Admin";
import HotOffer from "../pages/Offer/HotOffer";
import BookManagement from "../pages/Admin/Products";
import AddOrUpdateBook from "../pages/Admin/Products/AddOrUpdateBook";
import ReviewManagement from "../pages/Admin/Reviews";
import DetailBook from "../pages/Admin/Products/DetailProduct/DetailBook";
import UserList from "../pages/Admin/Users";
import UserDetail from "../pages/Admin/Users/UserDetail";
import { ProfileRoute } from "./ProfileRoute";
import { AdminRoute } from "./AdminRoute";
import { AnonymousRoute } from "./AnonymousRoute";
import ChangePassword from "../pages/User/ChangePassword";
import OrderConfirmation from "../pages/Checkout/OrderConfirmation";
import QRPayment from "../pages/Checkout/QRPayment";

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route element={<AnonymousRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route index element={<Home />} />
        <Route path="books" element={<ListProduct />} />
        <Route path="books/:id" element={<DetailProduct />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="hot-offers" element={<HotOffer />} />
        <Route element={<ProfileRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="orders" element={<NewOrders />} />
          <Route path="history-orders" element={<HistoryOrders />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="books" element={<BookManagement />} />
          <Route path="books/create" element={<AddOrUpdateBook />} />
          <Route path="books/update/:id" element={<AddOrUpdateBook />} />
          <Route path="books/:id" element={<DetailBook />} />
        </Route>
      </Route>
      <Route element={<ProfileRoute />}>
        <Route path="qr-payment" element={<QRPayment />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
      </Route>
    </Routes>
  );
};

export default RoutesApp;
