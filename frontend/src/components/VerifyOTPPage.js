import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Get the email passed via navigate

  useEffect(() => {
    // Countdown timer logic
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setError('OTP has expired. Please request a new one.');
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleVerifyOTP = async () => {
    if (timeLeft <= 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/verify', { email, otp });
      if (response.status === 200) {
        setSuccessMessage('OTP verified successfully!');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after successful verification
        }, 2000);
      }
    } catch (err) {
      setError('An error occurred while verifying OTP.');
      console.error('OTP verification error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <VerifySection>
      <FormContainer>
        <h2>Verify OTP</h2>
        <p>Please enter the OTP sent to your email: {email}</p>
        <Input
          type="text"
          placeholder="Enter your OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Timer>Time remaining: {formatTime(timeLeft)}</Timer>
        <Button onClick={handleVerifyOTP}>Verify OTP</Button>
        {error && <Error>{error}</Error>}
        {successMessage && <Success>{successMessage}</Success>}
      </FormContainer>
    </VerifySection>
  );
};

// Aesthetic and Styling Improvements

const VerifySection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #e0e0e0, #c0c0c0);
  font-family: 'Arial', sans-serif;
`;

const FormContainer = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  h2 {
    color: #333;
    margin-bottom: 10px;
    font-size: 28px;
  }
  p {
    margin-bottom: 20px;
    color: #555;
  }
`;

const Input = styled.input`
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: all 0.3s ease;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  width: 100%;
  &:hover {
    background-color: #0056b3;
  }
`;

const Timer = styled.p`
  color: #e67e22;
  font-weight: bold;
  margin-bottom: 10px;
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

export default VerifyOTPPage;
