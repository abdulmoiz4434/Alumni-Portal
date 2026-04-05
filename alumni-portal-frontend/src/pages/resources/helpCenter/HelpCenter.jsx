import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, UserPlus, Users, Briefcase, BookOpen } from 'lucide-react';
import './HelpCenter.css';

const topics = [
  {
    id: 1,
    icon: UserPlus,
    question: 'How to create an account',
    answer:
      'To create an account on the Alumni Portal, navigate to the login page and click "Register". Fill in your full name, university email address, graduation year, and choose your role (Student or Alumni). After submitting the form, you will receive a verification email — click the link inside to activate your account. Once verified, log in with your credentials and complete your profile by adding your department, skills, and a profile photo.',
  },
  {
    id: 2,
    icon: Users,
    question: 'How to connect with alumni',
    answer:
      'You can connect with alumni through two main features. First, visit the Alumni Directory under the modules section — use the search and filter tools to find alumni by name, graduation year, or field of expertise. Second, explore the Mentorship module where alumni who have opted in as mentors are listed. Send a connection or mentorship request directly from their profile. You can also meet alumni at events listed in the Events module.',
  },
  {
    id: 3,
    icon: Briefcase,
    question: 'How to apply for jobs',
    answer:
      'Head to the Job Board module from the sidebar. Browse all active job postings, which are shared by alumni and partner organizations. Each listing shows the role title, company, location, salary range, and posting date. Click on a listing to view full details, then use the "Apply" button to submit your application. Alumni can also post job openings by using the "Post a Job" option available within the Job Board module (requires alumni role).',
  },
  {
    id: 4,
    icon: BookOpen,
    question: 'How to join mentorship programs',
    answer:
      'Navigate to the Mentorship module from the sidebar. You will see a list of available mentors — alumni who have registered to guide students and fellow alumni. Filter by area of expertise, industry, or availability. Click on a mentor\'s card to view their background and then send them a mentorship request. Once accepted, you can communicate through the built-in Messaging module. Students are encouraged to have clear goals before reaching out to make the most of the mentorship experience.',
  },
];

const HelpCenter = () => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="helpcenter-container">
      <div className="helpcenter-hero">
        <h1>Help Center</h1>
        <p className="helpcenter-subtitle">
          Welcome to the Alumni Portal Help Center. Find step-by-step guidance on
          everything you need to get started and make the most of the platform.
        </p>
      </div>

      <div className="helpcenter-accordion">
        {topics.map(({ id, icon: Icon, question, answer }) => {
          const isOpen = openId === id;
          return (
            <div key={id} className={`accordion-item ${isOpen ? 'accordion-item--open' : ''}`}>
              <button
                className="accordion-trigger"
                onClick={() => toggle(id)}
                aria-expanded={isOpen}
              >
                <span className="accordion-trigger-left">
                  <span className="accordion-icon-wrapper">
                    <Icon size={18} />
                  </span>
                  <span className="accordion-question">{question}</span>
                </span>
                <span className="accordion-chevron">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>
              <div className={`accordion-body ${isOpen ? 'accordion-body--visible' : ''}`}>
                <p className="accordion-answer">{answer}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="helpcenter-footer-note">
        <p>
          Still have questions?{' '}
          <Link to="/contactSupport">Contact our support team</Link> or browse the{' '}
          <Link to="/faqs">FAQs</Link>.
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;