import { useState } from "react";
import { User, Calendar, X, Search, UserPlus, PlusCircle } from "lucide-react";
import "./Mentorship.css";

export default function Mentorship() {
  const [mentorships, setMentorships] = useState([
    {
      id: 1,
      title: "React & Frontend Development",
      mentor: {
        name: "Ali Khan",
        avatar: "/mentor1.jpg",
        role: "Senior Frontend Engineer",
        company: "Google",
        batch: "2018",
      },
      field: "Frontend Development",
      duration: "3 months",
      description:
        "Get hands-on guidance on building modern React applications, state management, performance optimization, and best practices from a senior developer working at Google.",
      skills: ["React", "TypeScript", "Next.js", "UI/UX"],
    },
    {
      id: 2,
      title: "Data Science & Machine Learning",
      mentor: {
        name: "Sara Ahmed",
        avatar: "/mentor2.jpg",
        role: "Data Scientist",
        company: "Microsoft",
        batch: "2017",
      },
      field: "Data Science & AI",
      duration: "6 months",
      description:
        "Learn data analysis, machine learning algorithms, deep learning, and real-world AI applications from an expert data scientist. Perfect for aspiring ML engineers.",
      skills: ["Python", "TensorFlow", "ML", "Statistics"],
    },
    {
      id: 3,
      title: "Career Growth & Networking",
      mentor: {
        name: "Usman Iqbal",
        avatar: "/mentor3.jpg",
        role: "Engineering Manager",
        company: "Amazon",
        batch: "2016",
      },
      field: "Career Development",
      duration: "2 months",
      description:
        "One-on-one mentorship to help you plan your career path, improve networking skills, prepare for interviews, and navigate the tech industry landscape.",
      skills: ["Leadership", "Interviews", "Networking", "Strategy"],
    },
    {
      id: 4,
      title: "Mobile App Development",
      mentor: {
        name: "Fatima Malik",
        avatar: "/mentor4.jpg",
        role: "Mobile Engineer",
        company: "Meta",
        batch: "2019",
      },
      field: "Mobile Development",
      duration: "4 months",
      description:
        "Master iOS and Android development with React Native and Flutter. Build production-ready mobile apps with guidance from a Meta mobile engineer.",
      skills: ["React Native", "Flutter", "iOS", "Android"],
    },
    {
      id: 5,
      title: "Backend & System Design",
      mentor: {
        name: "Ahmed Hassan",
        avatar: "/mentor5.jpg",
        role: "Backend Architect",
        company: "Netflix",
        batch: "2015",
      },
      field: "Backend Engineering",
      duration: "5 months",
      description:
        "Deep dive into backend development, microservices architecture, system design, and scalability. Learn to build robust distributed systems.",
      skills: ["Node.js", "System Design", "AWS", "Databases"],
    },
    {
      id: 6,
      title: "Product Management",
      mentor: {
        name: "Zainab Ali",
        avatar: "/mentor6.jpg",
        role: "Senior Product Manager",
        company: "Spotify",
        batch: "2017",
      },
      field: "Product Management",
      duration: "3 months",
      description:
        "Learn product strategy, user research, roadmap planning, and stakeholder management from an experienced PM at a leading tech company.",
      skills: ["Strategy", "User Research", "Analytics", "Leadership"],
    },
  ]);

  const [filterField, setFilterField] = useState("All");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    batch: "",
    goals: "",
    experience: "",
  });

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [newMentorshipForm, setNewMentorshipForm] = useState({
    title: "",
    name: "",
    avatar: "",
    role: "",
    company: "",
    batch: "",
    field: "",
    duration: "",
    description: "",
    skills: "",
  });

  const fields = ["All", ...new Set(mentorships.map((m) => m.field))];

  const filteredMentorships =
    filterField === "All"
      ? mentorships
      : mentorships.filter((m) => m.field === filterField);

  const handleConnect = (mentorship) => {
    setSelectedMentorship(mentorship);
    setShowConnectModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewFormChange = (e) => {
    const { name, value } = e.target;
    setNewMentorshipForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Application submitted:", {
      mentorshipId: selectedMentorship.id,
      ...applicationForm,
    });
    setApplicationForm({
      name: "",
      email: "",
      batch: "",
      goals: "",
      experience: "",
    });
    setShowConnectModal(false);
    setSelectedMentorship(null);
  };

  const handleOfferSubmit = () => {
    const newMentorship = {
      id: mentorships.length + 1,
      title: newMentorshipForm.title,
      mentor: {
        name: newMentorshipForm.name,
        avatar: newMentorshipForm.avatar,
        role: newMentorshipForm.role,
        company: newMentorshipForm.company,
        batch: newMentorshipForm.batch,
      },
      field: newMentorshipForm.field,
      duration: newMentorshipForm.duration,
      description: newMentorshipForm.description,
      skills: newMentorshipForm.skills.split(",").map((s) => s.trim()),
    };
    setMentorships([newMentorship, ...mentorships]);
    setNewMentorshipForm({
      title: "",
      name: "",
      avatar: "",
      role: "",
      company: "",
      batch: "",
      field: "",
      duration: "",
      description: "",
      skills: "",
    });
    setShowOfferModal(false);
  };

  return (
    <div className="mentorship-page">
      <div className="mentorship-hero">
        <div className="mentorship-hero-content">
          <h1 className="mentorship-title">Mentorship Program</h1>
          <p className="mentorship-subtitle">
            Connect with experienced alumni who are ready to guide you on your
            career journey
          </p>
          <button className="offer-btn" onClick={() => setShowOfferModal(true)}>
            Offer Mentorship
          </button>
        </div>
      </div>

      <div className="mentorship-container">
        <div className="mentorship-filters">
          <div className="filter-label">Filter by field:</div>
          <div className="filter-buttons">
            {fields.map((field) => (
              <button
                key={field}
                className={`filter-btn ${filterField === field ? "filter-btn-active" : ""}`}
                onClick={() => setFilterField(field)}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        <div className="mentorship-grid">
          {filteredMentorships.map((mentorship) => (
            <article key={mentorship.id} className="mentorship-card">
              <div className="mentor-header">
                <div className="mentor-avatar-wrapper">
                  {mentorship.mentor.avatar ? (
                    <img
                      src={mentorship.mentor.avatar}
                      alt={mentorship.mentor.name}
                      className="mentor-avatar"
                    />
                  ) : (
                    <div className="mentor-avatar-placeholder">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div className="mentor-info">
                  <h3 className="mentor-name">{mentorship.mentor.name}</h3>
                  <p className="mentor-role">{mentorship.mentor.role}</p>
                  <p className="mentor-company">
                    {mentorship.mentor.company} • Batch{" "}
                    {mentorship.mentor.batch}
                  </p>
                </div>
              </div>

              <div className="mentorship-details">
                <h2 className="mentorship-program-title">{mentorship.title}</h2>
                <p className="mentorship-description">
                  {mentorship.description}
                </p>
                <div className="mentorship-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{mentorship.duration}</span>
                  </div>
                </div>

                <div className="skills-list">
                  {mentorship.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className="connect-button"
                onClick={() => handleConnect(mentorship)}
              >
                Connect with Mentor
              </button>
            </article>
          ))}
        </div>

        {filteredMentorships.length === 0 && (
          <div className="mentorship-empty">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">No mentorships found in this category</p>
          </div>
        )}
      </div>

      {/* Connect Modal */}
      {showConnectModal && selectedMentorship && (
        <div
          className="modal-overlay"
          onClick={() => setShowConnectModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Apply for Mentorship</h2>
                <p className="modal-program-name">{selectedMentorship.title}</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowConnectModal(false)}
              >
                <X size={22} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={applicationForm.name}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
       
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={applicationForm.email}
                    onChange={handleFormChange}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch Year *</label>
                  <input
                    type="text"
                    name="batch"
                    value={applicationForm.batch}
                    onChange={handleFormChange}
                    className="form-input"
                    placeholder="e.g., 2023"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Goals *</label>
                <textarea
                  name="goals"
                  value={applicationForm.goals}
                  onChange={handleFormChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="What do you hope to achieve through this mentorship?"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Current Experience & Background
                </label>
                <textarea
                  name="experience"
                  value={applicationForm.experience}
                  onChange={handleFormChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Tell us about your current skills and experience..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-button modal-button-cancel"
                onClick={() => setShowConnectModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-submit"
                onClick={handleSubmit}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Mentorship Modal */}
      {showOfferModal && (
        <div className="modal-overlay" onClick={() => setShowOfferModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Offer Mentorship</h2>
              <button
                className="modal-close"
                onClick={() => setShowOfferModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Mentorship Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. React & Frontend Career Guidance"
                  value={newMentorshipForm.title}
                  onChange={handleNewFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Ahmed Khan"
                  value={newMentorshipForm.name}
                  onChange={handleNewFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    name="role"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={newMentorshipForm.role}
                    onChange={handleNewFormChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Google"
                    value={newMentorshipForm.company}
                    onChange={handleNewFormChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Batch Year</label>
                <input
                  type="text"
                  name="batch"
                  placeholder="e.g. 2018"
                  value={newMentorshipForm.batch}
                  onChange={handleNewFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Field</label>
                <input
                  type="text"
                  name="field"
                  placeholder="e.g. Frontend Development"
                  value={newMentorshipForm.field}
                  onChange={handleNewFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 3 months"
                  value={newMentorshipForm.duration}
                  onChange={handleNewFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  placeholder="Briefly describe what mentees will learn and how you will guide them"
                  value={newMentorshipForm.description}
                  onChange={handleNewFormChange}
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React, JavaScript, UI/UX, Career Planning"
                  value={newMentorshipForm.skills}
                  onChange={handleNewFormChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-button modal-button-cancel"
                onClick={() => setShowOfferModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-submit"
                onClick={handleOfferSubmit}
              >
                Add Mentorship
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
