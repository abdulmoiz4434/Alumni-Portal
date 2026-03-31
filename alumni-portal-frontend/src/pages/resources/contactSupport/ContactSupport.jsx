import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Instagram,
  Clock,
} from 'lucide-react';
import './ContactSupport.css';

const Support = () => {
  return (
    <div className="support-container">
      <div className="support-hero">
        <h1>Contact Support</h1>
        <p className="support-subtitle">
          Need help? Our team is here for you. Reach out through any of the
          channels below and we will get back to you as soon as possible.
        </p>
      </div>

      <div className="support-cards-grid">
        <div className="support-card">
          <div className="support-card-icon">
            <Mail size={22} />
          </div>
          <div className="support-card-body">
            <h3>Email Us</h3>
            <p>For general enquiries and support requests</p>
            <a href="mailto:info@usp.edu.pk" className="support-link">
              info@usp.edu.pk
            </a>
          </div>
        </div>

        <div className="support-card">
          <div className="support-card-icon">
            <Phone size={22} />
          </div>
          <div className="support-card-body">
            <h3>Call Us</h3>
            <p>Speak directly with our support desk</p>
            <a href="tel:+926111477786" className="support-link">
              +92-61-111-477-786
            </a>
          </div>
        </div>

        <div className="support-card">
          <div className="support-card-icon">
            <MapPin size={22} />
          </div>
          <div className="support-card-body">
            <h3>Visit Us</h3>
            <p>Drop by our campus office in person</p>
            <span className="support-link">USP, Multan, Pakistan</span>
          </div>
        </div>
        <div className="support-card">
          <div className="support-card-icon">
            <Clock size={22} />
          </div>
          <div className="support-card-body">
            <h3>Office Hours</h3>
            <p>Available during university working days</p>
            <span className="support-link">Sun – Thu, 9:00 AM – 5:00 PM</span>
          </div>
        </div>
      </div>
      <div className="support-social-section">
        <h2>Connect With Us</h2>
        <p>Follow us on social media for updates, announcements, and community highlights.</p>
        <div className="support-social-links">
          <a
            href="https://www.linkedin.com/school/uspmultan/"
            target="_blank"
            rel="noopener noreferrer"
            className="support-social-btn"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://www.facebook.com/share/1EvDXpD6Gv/"
            target="_blank"
            rel="noopener noreferrer"
            className="support-social-btn"
            aria-label="Facebook"
          >
            <Facebook size={18} />
            <span>Facebook</span>
          </a>
          <a
            href="https://www.instagram.com/uspofficialmultan?igsh=ZDY4eTllbzlqNms1"
            target="_blank"
            rel="noopener noreferrer"
            className="support-social-btn"
            aria-label="Instagram"
          >
            <Instagram size={18} />
            <span>Instagram</span>
          </a>
        </div>
      </div>

      <div className="support-also-see">
        <p>
          You may also find answers in our{' '}
          <Link to="/helpCenter">Help Center</Link> or{' '}
          <Link to="/faqs">FAQs</Link> before reaching out.
        </p>
      </div>
    </div>
  );
};

export default Support;