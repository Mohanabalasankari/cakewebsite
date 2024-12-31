import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import VerifyOTPPage from "./components/VerifyOTPPage";
import Homepage from "./components/Homepage";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminDashboard from "./components/AdminDashboard";
import ClientProductList from "./components/Menu";
import ProfilePage from "./components/ProfilePage";
import CartPage from "./components/CartPage";
const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyOTPPage />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/menu" element={<ClientProductList />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
    </Router>
  );
};

export default App;
