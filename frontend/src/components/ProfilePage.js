import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, Redirect } from "react-router-dom"; // Import Link for navigation

// Styled Components
const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #ffe4e1;
  min-height: 100vh;
  margin: 0;
  padding: 0;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffb6c1;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #fff5f5;
  }
`;

const ProfileContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileCard = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Header = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Field = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 0.5rem 0;

  strong {
    color: #000;
  }
`;

const LogoutButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  color: white;
  background-color: #d9534f;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token-based authentication
        if (!token) {
          window.location.href = "/login"; // Redirect to login if no token
          return;
        }
        const response = await axios.get("http://localhost:8080/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load profile. Please log in again.");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page after logout
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <AppContainer>
      <NavBar>
        <NavLink to="/">
          Home
        </NavLink>
        <NavLinks>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/login">Login</NavLink>
        </NavLinks>
      </NavBar>

      <ProfileContainer>
        <ProfileCard>
          <Header>Welcome, {user.name}!</Header>
          <Field>
            <strong>Email:</strong> {user.email}
          </Field>
          <Field>
            <strong>Phone:</strong> {user.phone}
          </Field>
          <Field>
            <strong>Address:</strong> {user.address}
          </Field>
          <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
        </ProfileCard>
      </ProfileContainer>
    </AppContainer>
  );
};

export default ProfilePage;
