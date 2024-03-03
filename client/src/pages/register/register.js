import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
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
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password2">Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                id="password2"
                placeholder="Confirm password"
                onChange={e => setPassword2(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-dark btn-block">
              Register
            </button>
          </form>
          <div className="text-center mt-3">
            <p>
              Already have an account? <Link to="/login">Login Now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
