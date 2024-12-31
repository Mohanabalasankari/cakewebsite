import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom"; // Import Link for navigation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import cake1 from './image/Cream cake for the Princess 🦄🧁.jpg';
import cake2 from './image/download (1).jpg';
import cake3 from './image/download (2).jpg';
import cake4 from './image/download.jpg';

const images = [cake1, cake2, cake3, cake4];

// Styled Components
const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #ffe4e1; /* Baby pink background */
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

const MainContent = styled.main`
  text-align: center;
  padding: 2rem;
`;

const Header = styled.h1`
  font-size: 3rem;
  color: #d2698f;
  margin-bottom: 1rem;
`;

const SubText = styled.p`
  font-size: 1.2rem;
  color: #8b5f67;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  color: white;
  background-color: #ff69b4;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff85c0;
  }
`;

const CarouselContainer = styled.div`
  margin: 2rem auto;
  width: 500%;
  max-width: 1200px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  .react-multi-carousel-item img {
    max-height: 200px;
    object-fit: cover;
    width: 100%;
  }

  .react-multi-carousel-dot button {
    background-color: #ff69b4 !important; /* Match theme */
    border: none;
  }

  .react-multi-carousel-dot--active button {
    background-color: #d2698f !important;
  }
`;

// Carousel Configuration
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

// Homepage Component
const Homepage = () => {
  return (
    <AppContainer>
      <NavBar>
        <NavLink to="/">
          <FontAwesomeIcon icon={faHome} /> Home
        </NavLink>
        <NavLinks>
          <NavLink to="/cart">
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
          </NavLink>
          <NavLink to="/login">
            <FontAwesomeIcon icon={faUser} /> Login
          </NavLink>
        </NavLinks>
      </NavBar>

      <MainContent>
        <Header>Welcome to Sweet Treats</Header>
        <SubText>Your one-stop destination for delightful cakes and desserts!</SubText>
        
        <CarouselContainer>
          <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={3000}>
            {images.map((src, index) => (
              <img key={index} src={src} alt={`Cake ${index + 1}`} style={{ borderRadius: "10px" }} />
            ))}
          </Carousel>
        </CarouselContainer>

        {/* Wrap the button with Link to navigate to the menu page */}
        <Link to="/menu">
          <Button>Explore Our Menu</Button>
        </Link>
      </MainContent>
    </AppContainer>
  );
};

export default Homepage;
