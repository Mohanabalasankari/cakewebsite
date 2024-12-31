import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart, faUser, faBars } from '@fortawesome/free-solid-svg-icons';

// Styled components
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

const MenuButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: white;

  &:hover {
    color: #fff5f5;
  }
`;

const ProductListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 2rem;
`;

const ProductCard = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ProductTitle = styled.h4`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ProductPrice = styled.p`
  color: #ff69b4;
  font-size: 1.2rem;
  font-weight: bold;
`;

// ClientProductList Component
const ClientProductList = () => {
  const [products, setProducts] = useState([]);
  const userId = 'exampleUserId'; // Replace with dynamic user ID logic.

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post('http://localhost:8080/api/cart/add', {
        userId,
        productId,
      });
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AppContainer>
      {/* Navbar */}
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

      {/* Product List */}
      <ProductListContainer>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id}>
              {product.image && (
                <ProductImage
                  src={`http://localhost:8080${product.image}`}
                  alt={product.name}
                />
              )}
              <ProductTitle>{product.name}</ProductTitle>
              <ProductDescription>{product.description}</ProductDescription>
              <ProductPrice>₹{product.price}</ProductPrice>
              <button onClick={() => addToCart(product._id)}>
                Add to Cart
              </button>
            </ProductCard>
          ))
        ) : (
          <p>No products available at the moment.</p>
        )}
      </ProductListContainer>
    </AppContainer>
  );
};

export default ClientProductList;
