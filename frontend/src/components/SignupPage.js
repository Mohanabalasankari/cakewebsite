import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', { email, password, name, phone, address });
      if (response.status === 200) {
        setSuccessMessage('Signup successful! Please check your email for OTP.');
        setTimeout(() => {
          navigate('/verify', { state: { email } });
        }, 2000);
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error('Signup error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <SignupSection>
      <FormContainer>
        <h2>Sign Up</h2>
        <Form>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button onClick={handleSignup}>Sign Up</Button>
          {error && <Error>{error}</Error>}
          {successMessage && <Success>{successMessage}</Success>}
        </Form>
      </FormContainer>
    </SignupSection>
  );
};

// Aesthetic styles start here

const SignupSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #e2e2e2, #c9c9c9);
  font-family: 'Arial', sans-serif;
`;

const FormContainer = styled.div`
  background: #fff;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 28px;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  }
`;

const Button = styled.button`
  padding: 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease;
  margin-top: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

const Error = styled.p`
  color: #e74c3c;
  font-weight: bold;
  margin-top: 10px;
`;

const Success = styled.p`
  color: #2ecc71;
  font-weight: bold;
  margin-top: 10px;
`;

export default SignupPage;
