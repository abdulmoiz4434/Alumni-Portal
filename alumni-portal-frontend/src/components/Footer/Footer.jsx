import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Github,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Logo and Description */}
          <div className="footer-column footer-about">
            <div className="footer-logo">
              <div className="logo-circle">AP</div>
              <h3>Alumni Portal</h3>
            </div>
            <p className="footer-description">
              Connecting students and alumni to foster mentorship, career
              growth, and lifelong relationships.
            </p>
            <div className="footer-social">
              <a
                href="https://www.linkedin.com/school/uspmultan/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.facebook.com/share/1EvDXpD6Gv/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/uspofficialmultan?igsh=ZDY4eTllbzlqNms1"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/modules/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/modules/events">Events</Link>
              </li>
              <li>
                <Link to="/modules/jobs">Job Board</Link>
              </li>
              <li>
                <Link to="/modules/mentorship">Mentorship</Link>
              </li>
              <li>
                <Link to="/modules/directory">Alumni Directory</Link>
              </li>
              <li>
                <Link to="/modules/about">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li>
                <Link to="/help">Help Center</Link>
              </li>
              <li>
                <Link to="/faqs">FAQs</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/support">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <Mail size={16} />
                <a href="mailto:alumni@university.edu">alumni@university.edu</a>
              </li>
              <li>
                <Phone size={16} />
                <a href="tel:+92-XXX-XXXXXXX">+92-XXX-XXXXXXX</a>
              </li>
              <li>
                <MapPin size={16} />
                <span>University Campus, City, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Alumni Portal. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <span className="separator">•</span>
            <Link to="/terms">Terms</Link>
            <span className="separator">•</span>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
