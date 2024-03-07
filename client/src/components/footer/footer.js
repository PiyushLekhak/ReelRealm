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
            Welcome to ReelRealm, where cinematic wonders come to life! Dive
            into a world of enchanting narratives, captivating performances, and
            immersive storytelling. From in-depth movie reviews to
            behind-the-scenes insights, we unlock the magic of cinema for
            cinephiles and entertainment enthusiasts alike. Explore, discover,
            and experience the reel magic at ReelRealm!
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
              <a href="/*">Terms of Service</a>
            </li>
            <li>
              <a href="/*">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-content3">
          <ul>
            For inquiries, collaborations, or just to say hello, reach out to us
            on our social platforms. Let's connect and celebrate the love for
            movies!
          </ul>
          <ul class="footer-links2">
            <ul>
              <a href="https://twitter.com/" target="blank">
                <FaTwitter />
              </a>
            </ul>
            <ul>
              <a href="https://www.facebook.com/" target="blank">
                <FaFacebook />
              </a>
            </ul>
            <ul>
              <a href="https://www.instagram.com/" target="blank">
                <FaInstagram />
              </a>
            </ul>
            <ul>
              <a href="https://github.com/" target="blank">
                <FaGithub />
              </a>
            </ul>
          </ul>
        </div>
      </div>
      <br />
      <div style={{ textAlign: "center" }}>&copy; ReelRealm</div>
    </div>
  );
}
