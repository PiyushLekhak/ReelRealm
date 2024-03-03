import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import "./login.css";

function Login() {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    email.length > 0 && loginUser(email, password);

    console.log(email);
    console.log(password);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
              />
            </div>
            <button type="submit" className="btn btn-dark btn-block">
              Login
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="mb-1">
              Forgot password? <a href="#!">Reset here</a>
            </p>
            <p>
              Don't have an account?{' '}
              <Link to="/register">Register Now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
