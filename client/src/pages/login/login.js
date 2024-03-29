import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { FaLock, FaUser, FaGoogle, FaFacebook } from "react-icons/fa";
import "./login.css";

function Login() {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    email.length > 0 && loginUser(email, password);

    console.log(email);
    console.log(password);
  };

  const handleForgotPassword = () => {
    window.location.href = "http://127.0.0.1:8000/reset_password/";
  };

  return (
    <div>
      <div className="signin-container">
        <div className="signin-wrapper">
        <img src="/images/Logo.png" alt="Logo" className="logo" />
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-fields">
              <FaUser className="icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="login-inputs"
              />
            </div>
            <div className="input-fields">
              <FaLock className="icon" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="login-inputs"
              />
            </div>
            <div className="forgot-password-container">
              <button onClick={handleForgotPassword} className="forgot-password-link">
                Forgot Password?
              </button>
            </div>
            <button className="login-button"> Login </button>
          </form>
          <br />
          <p style={{ color: "white" }}>
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Register Now
            </Link>
          </p>
          <br/>
          <h2>OR</h2>
          <br />
          <button className="media-btn">
            {" "}
            <FaGoogle className="social-media-icon" /> Sign in with Google{" "}
          </button>
          {/* <br />
          <button className="media-btn">
            {" "}
            <FaFacebook className="social-media-icon" /> Sign in with Facebook{" "}
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
