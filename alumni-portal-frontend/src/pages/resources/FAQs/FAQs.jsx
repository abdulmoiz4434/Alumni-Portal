import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FAQs.css';

const faqs = [
  {
    id: 1,
    question: 'Who can use this portal?',
    answer:
      'The Alumni Portal is open to all current students and alumni of the University of South Punjab (USP), Multan. Students can explore events, job listings, and connect with mentors, while alumni can post job opportunities, offer mentorship, and contribute to the community through success stories.',
  },
  {
    id: 2,
    question: 'Is this platform free?',
    answer:
      'Yes, the Alumni Portal is completely free for all registered university members — students and alumni alike. There are no subscription fees, hidden charges, or premium tiers. All features including mentorship, job board, events, and messaging are fully accessible at no cost.',
  },
  {
    id: 3,
    question: 'How do I contact support?',
    answer:
      'You can reach our support team by visiting the Contact Support page from the Resources section in the footer. Alternatively, email us directly at info@usp.edu.pk or call +92-61-111-477-786. Our team is available during university working hours, Sunday through Thursday.',
  },
  {
    id: 4,
    question: 'How do I update my profile information?',
    answer:
      'After logging in, click on your profile avatar or navigate to the Profile module from the sidebar. You can update your full name, profile picture, department, graduation year, skills, bio, and social links. Remember to save your changes before leaving the page.',
  },
  {
    id: 5,
    question: 'Can alumni post job openings?',
    answer:
      'Yes. Alumni with registered accounts can post job opportunities on the Job Board. Navigate to the Job Board module and look for the "Post a Job" option. You will be asked to fill in the role title, company, location, job type, salary range, and a description. Once submitted, the posting becomes visible to all portal members.',
  },
  {
    id: 6,
    question: 'How does the mentorship program work?',
    answer:
      'Alumni can opt in as mentors by updating their profile settings. Students and alumni seeking guidance can browse available mentors in the Mentorship module, filtered by industry or expertise. Send a mentorship request with a short message. Once the mentor accepts, you can communicate through the built-in Messaging module to schedule sessions and share resources.',
  },
  {
    id: 7,
    question: 'Is my personal data kept private?',
    answer:
      'Absolutely. We take data privacy seriously. Your personal information is stored securely and is only visible to other registered members as per your privacy settings. We do not sell or share your data with third parties without your explicit consent. For full details, please refer to our Privacy Policy page.',
  },
];

const FAQs = () => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="faqs-container">
      <div className="faqs-hero">
        <h1>Frequently Asked Questions</h1>
        <p className="faqs-subtitle">
          Find quick answers to the most common questions about the Alumni Portal.
        </p>
      </div>

      <div className="faqs-list">
        {faqs.map(({ id, question, answer }) => {
          const isOpen = openId === id;
          return (
            <div key={id} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
              <button
                className="faq-trigger"
                onClick={() => toggle(id)}
                aria-expanded={isOpen}
              >
                <span className="faq-question">{question}</span>
                <span className="faq-chevron">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>
              <div className={`faq-body ${isOpen ? 'faq-body--visible' : ''}`}>
                <p className="faq-answer">{answer}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="faqs-footer-note">
        <p>
          Didn&apos;t find what you were looking for?{' '}
          <Link to="/helpCenter">Visit the Help Center</Link> or{' '}
          <Link to="/contactSupport">contact our support team</Link>.
        </p>
      </div>
    </div>
  );
};

export default FAQs;