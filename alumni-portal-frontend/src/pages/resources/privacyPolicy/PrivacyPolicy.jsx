import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

const sections = [
  {
    title: 'Information We Collect',
    content:
      'When you register on the Alumni Portal, we collect information such as your full name, university email address, graduation year, department, and role (student or alumni). As you use the platform, we may also collect activity data including events you attend, jobs you view, mentorships you participate in, and messages you send through our built-in messaging system.',
  },
  {
    title: 'How We Use Your Information',
    content:
      'Your information is used to provide and improve the Alumni Portal experience. This includes personalising your dashboard, displaying relevant job postings and events, enabling connections with other members, and sending you notifications related to your activity. We may also use aggregated, anonymised data to generate platform analytics and improve our services.',
  },
  {
    title: 'Data Sharing',
    content:
      'We do not sell, trade, or rent your personal information to third parties. Your profile data is visible to other registered members of the portal according to your privacy settings. In limited cases, we may share data with trusted university administrative staff for verification purposes — always in compliance with applicable data protection regulations.',
  },
  {
    title: 'Data Protection & Security',
    content:
      'Your data is stored on secure servers with industry-standard encryption in transit and at rest. We implement access controls, secure authentication, and regular security audits to safeguard your information. In the unlikely event of a data breach, we will notify affected users promptly and take immediate remediation steps.',
  },
  {
    title: 'Cookies & Tracking',
    content:
      'The Alumni Portal uses cookies solely for session management and authentication purposes. We do not use third-party tracking cookies or advertising networks. You may disable cookies in your browser settings, although doing so may affect your ability to log in and use the platform normally.',
  },
  {
    title: 'Your Rights',
    content:
      'You have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, contact us at info@usp.edu.pk. You may also update your personal information directly from your profile settings within the portal. Account deletion requests are processed within 7 working days.',
  },
  {
    title: 'Changes to This Policy',
    content:
      'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we do, we will update the "Last Revised" date at the top of this page and notify registered users via email or an in-app notification. Continued use of the portal after changes are posted constitutes your acceptance of the updated policy.',
  },
];

const Privacy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p className="privacy-meta">Last Revised: March 2025</p>
        <p className="privacy-intro">
          At the Alumni Portal of the University of South Punjab, we are committed to protecting
          your privacy. This policy explains what information we collect, how we use it, and the
          choices you have regarding your data.
        </p>
      </div>

      <div className="privacy-sections">
        {sections.map(({ title, content }) => (
          <div key={title} className="privacy-section">
            <h3>{title}</h3>
            <p>{content}</p>
          </div>
        ))}
      </div>

      <div className="privacy-contact-note">
        <p>
          Questions about this policy? Email us at{' '}
          <a href="mailto:info@usp.edu.pk">info@usp.edu.pk</a> or visit our{' '}
          <Link to="/contactSupport">Contact Support</Link> page.
        </p>
      </div>
    </div>
  );
};

export default Privacy;