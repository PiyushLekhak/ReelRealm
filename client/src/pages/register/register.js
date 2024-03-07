import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FaUser, FaLock } from 'react-icons/fa';
import "./register.css";

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const { registerUser } = useContext(AuthContext);

  const handleSubmit = e => {
    e.preventDefault();
    registerUser(email, username, password, password2);
  };

  return (
    <div className="signin-container">
      <div className="signin-wrapper">
        <img src="/images/Logo.png" alt="Logo" className="logo" />
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-fields">
            <FaUser className="icon" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="login-inputs"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="input-fields">
            <FaUser className="icon" />
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="login-inputs"
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="input-fields">
            <FaLock className="icon" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="login-inputs"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="input-fields">
            <FaLock className="icon" />
            <input
              type="password"
              id="password2"
              placeholder="Confirm Password"
              className="login-inputs"
              onChange={e => setPassword2(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
        </form>
        <div className="text-center mt-3">
          <p>
            Already have an account? <Link to="/login" className="register-link">Login Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
