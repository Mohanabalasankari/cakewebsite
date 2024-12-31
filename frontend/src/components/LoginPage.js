import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true); // Set loading to true while making request

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        // Save JWT token to localStorage or handle it as needed
        localStorage.setItem('token', response.data.token); // Adjust based on response structure
        navigate('/profile');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <LoginSection>
      <FormContainer>
        <h2>Login to Your Account</h2>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {error && <Error>{error}</Error>}
        <SignUpLink onClick={() => navigate('/signup')}>Don't have an account? Sign Up</SignUpLink>
      </FormContainer>
    </LoginSection>
  );
};

// Styling
const LoginSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color:white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const FormContainer = styled.div`
  background: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: all 0.3s ease;

  h2 {
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: bold;
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border 0.3s ease;

  &:focus {
    border-color: #6d83f2;
    outline: none;
    box-shadow: 0 0 5px rgba(109, 131, 242, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #6d83f2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  
  &:hover {
    background-color: #4d6de6;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Error = styled.p`
  color: #e74c3c;
  margin-top: 15px;
  font-size: 14px;
  font-weight: bold;
`;

const SignUpLink = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #6d83f2;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginPage;
