import React from "react";
import { FaFacebook, FaTwitter, FaGithub, FaInstagram } from "react-icons/fa";
import "./footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-section">ReelRealm</div>
        <div className="footer-section2">Useful Links</div>
        <div className="footer-section3">Contact Us</div>
        <div className="footer-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            faucibus arcu a justo aliquam, eu sodales odio placerat. Donec
            consequat purus ut lorem cursus, nec blandit lorem consequat. Nunc
            fringilla enim ac lorem bibendum, vitae cursus mauris lacinia.
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Donec fermentum nunc et libero dictum, in
            congue ligula condimentum. Integer non pharetra est. Nam vitae
            aliquam dui.
          </p>
        </div>
        <div className="footer-content2">
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/watchlist">My Watchlist</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-content3">
            <ul>
              Contact us for any queries about the recommendations. We can also
              provide assistance based on user preferences. We are the best.
            </ul>
            <ul class="footer-links2">
              <ul><a href="#"><FaTwitter /></a></ul>
              <ul><a href="#"><FaFacebook /></a></ul>
              <ul><a href="#"><FaInstagram /></a></ul>
              <ul><a href="#"><FaGithub /></a></ul>
            </ul>
        </div>
      </div>
      <br/>
      <div style={{textAlign: 'center'}}>&copy; ReelRealm</div>
    </div>
  );
}
