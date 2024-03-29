import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import "./forgotPassword.css";

function ForgotPassword() {
const [email, setEmail] = useState('');

const handleSubmit = e => {
    e.preventDefault();
    // Implement your forgot password logic here
    console.log("Forgot password logic goes here");
};

return (
    <div className="forgot-container">
    <div className="forgot-wrapper">
        <img src="/images/Logo.png" alt="Logo" className="logo" />
        <h1 style={{ paddingTop: '20px', paddingBottom: '20px' }}>Forgot Password</h1>
        <p style={{ marginBottom: '10px' }}>Please provide your email to reset your password:</p>
        <form onSubmit={handleSubmit}>
        <div className="input-fields">
            <FaUser className="icon" />
            <input
            type="email"
            id="email"
            placeholder="Email"
            className="login-inputs"
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
        </div>
        <button type="submit" className="login-button">
            Submit
        </button>
        </form>
        <div className="text-center mt-3">
        <p>
            Remembered your password? <Link to="/login" className="register-link">Back to Login</Link>
        </p>
        </div>
    </div>
    </div>
);
}

export default ForgotPassword;
