import { FiTwitter, FiLinkedin, FiInstagram } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <h3>
            Geo<span>Attend</span>
          </h3>
          <p>Smart, location-verified attendance for modern campuses.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#about">About</a>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <a href="#">Documentation</a>
          <a href="#">API Reference</a>
          <a href="#">Support</a>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#">
              <FiTwitter />
            </a>
            <a href="#">
              <FiLinkedin />
            </a>
            <a href="#">
              <FiInstagram />
            </a>
          </div>
        </div>
      </div>
      <p className="copyright">© 2026 GeoAttend. All rights reserved.</p>
    </footer>
  );
}
