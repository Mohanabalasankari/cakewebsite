import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CartContainer = styled.div`
  padding: 2rem;
  background-color: #ffe4e1;
`;

const CartItem = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartTitle = styled.h3`
  font-size: 1.5rem;
`;

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(''); // Assume user is logged in and userId is available

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cart/${userId}`);
      setCart(response.data.products);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/remove/${userId}/${productId}`);
      fetchCart(); // Refresh cart after removal
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContainer>
      <CartTitle>Your Cart</CartTitle>
      {cart.length > 0 ? (
        cart.map((item) => (
          <CartItem key={item.productId._id}>
            <div>
              <h4>{item.productId.name}</h4>
              <p>{item.productId.description}</p>
            </div>
            <div>
              <p>₹{item.productId.price}</p>
              <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
            </div>
          </CartItem>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </CartContainer>
  );
};

export default CartPage;
