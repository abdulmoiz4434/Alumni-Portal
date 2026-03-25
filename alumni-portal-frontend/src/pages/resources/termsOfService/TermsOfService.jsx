import { Link } from 'react-router-dom';
import './TermsOfService.css';

const sections = [
  {
    title: 'Acceptance of Terms',
    content:
      'By registering for or using the Alumni Portal of the University of South Punjab (USP), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. These terms apply to all users, including students, alumni, and administrative staff.',
  },
  {
    title: 'Eligibility',
    content:
      'The Alumni Portal is exclusively available to current students and alumni of the University of South Punjab. Access is granted upon successful registration with a valid university email address. The university reserves the right to verify eligibility and revoke access if a user is found to not meet the eligibility criteria.',
  },
  {
    title: 'User Responsibilities',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your login details with others, impersonate another user, post false or misleading information, engage in harassment, or use the platform for any unlawful purpose. Violations may result in immediate account suspension.',
  },
  {
    title: 'Account Security',
    content:
      'You are fully responsible for all activities that occur under your account. If you suspect unauthorized access to your account, notify us immediately at info@usp.edu.pk. We recommend using a strong password and logging out of shared or public devices. The Alumni Portal will never ask for your password via email or phone.',
  },
  {
    title: 'Acceptable Use',
    content:
      'You may use the Alumni Portal only for lawful purposes consistent with its intent — networking, mentorship, career development, and community engagement. You must not attempt to gain unauthorized access to any part of the platform, interfere with its operation, introduce malicious code, scrape data, or use automated tools to interact with the platform without prior written consent.',
  },
  {
    title: 'Content Ownership',
    content:
      'You retain ownership of any content you post on the portal, including job listings, messages, and profile information. By posting content, you grant the Alumni Portal a non-exclusive, royalty-free licence to display and distribute that content within the platform. You are solely responsible for ensuring your content does not infringe on third-party intellectual property rights.',
  },
  {
    title: 'Termination',
    content:
      'We reserve the right to suspend or permanently terminate your account at our sole discretion, without prior notice, if we determine that you have violated these Terms of Service. You may also choose to deactivate your account at any time by contacting support. Upon termination, your access to the platform will cease immediately.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'The Alumni Portal and the University of South Punjab are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. The portal is provided on an "as-is" basis. We do not guarantee uninterrupted access and reserve the right to modify or discontinue any feature at any time.',
  },
  {
    title: 'Changes to Terms',
    content:
      'We may update these Terms of Service at any time. When changes are made, the updated terms will be posted on this page and, where appropriate, communicated via email or in-app notification. Your continued use of the platform after changes are posted constitutes your acceptance of the revised terms. Please review this page periodically.',
  },
];

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-hero">
        <h1>Terms of Service</h1>
        <p className="terms-meta">Effective: March 2025</p>
        <p className="terms-intro">
          Please read these Terms of Service carefully before using the Alumni Portal. They
          govern your access to and use of all features and services provided by the platform.
        </p>
      </div>

      <div className="terms-sections">
        {sections.map(({ title, content }, index) => (
          <div key={title} className="terms-section">
            <h3>
              <span className="terms-section-num">{index + 1}.</span> {title}
            </h3>
            <p>{content}</p>
          </div>
        ))}
      </div>

      <div className="terms-contact-note">
        <p>
          Questions about these terms? Contact us at{' '}
          <a href="mailto:info@usp.edu.pk">info@usp.edu.pk</a> or visit our{' '}
          <Link to="/contactSupport">Contact Support</Link> page.
        </p>
      </div>
    </div>
  );
};

export default Terms;