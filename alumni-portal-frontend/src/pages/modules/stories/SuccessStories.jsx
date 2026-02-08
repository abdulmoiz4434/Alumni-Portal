import { useState } from "react";
import "./SuccessStories.css";

export default function SuccessStories() {
  // Mock data - will be replaced by backend API call
  const [stories, setStories] = useState([
    {
      id: 1,
      name: "Sarah Ahmed",
      avatar: "/avatar1.jpg",
      batch: "2020",
      role: "Software Engineer at Google",
      story:
        "After graduating from USP, I joined Google as a Software Engineer. The strong foundation in computer science and the supportive faculty prepared me well for the challenges in the tech industry. Today, I work on cutting-edge AI projects that impact millions of users worldwide.",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "Muhammad Hassan",
      avatar: "/avatar2.jpg",
      batch: "2019",
      role: "Entrepreneur & Founder",
      story:
        "My journey from USP led me to start my own tech startup. We've now raised $2M in funding and employ 25 people. The entrepreneurship courses and mentorship I received at university gave me the confidence to take this leap. Forever grateful to my alma mater!",
      date: "2024-01-10",
    },
    {
      id: 3,
      name: "Ayesha Khan",
      avatar: "/avatar3.jpg",
      batch: "2021",
      role: "Data Scientist at Microsoft",
      story:
        "USP's Data Science program opened doors I never imagined. Now working at Microsoft's Azure AI team, I develop machine learning models that help businesses make better decisions. The hands-on projects and research opportunities were invaluable.",
      date: "2024-01-05",
    },
    {
      id: 4,
      name: "Ali Raza",
      avatar: "/avatar4.jpg",
      batch: "2018",
      role: "PhD Candidate at MIT",
      story:
        "From Multan to MIT - USP made this journey possible. The rigorous curriculum and research culture prepared me for pursuing my PhD in Computer Vision. I'm now contributing to groundbreaking research in autonomous systems.",
      date: "2023-12-28",
    },
    {
      id: 5,
      name: "Fatima Malik",
      avatar: "/avatar5.jpg",
      batch: "2022",
      role: "UX Designer at Meta",
      story:
        "As a design graduate from USP, I learned that great design combines aesthetics with functionality. Now at Meta, I design experiences for billions of users. The design thinking methodology taught at USP is something I apply every single day.",
      date: "2023-12-20",
    },
    {
      id: 6,
      name: "Usman Tariq",
      avatar: "/avatar6.jpg",
      batch: "2020",
      role: "Cybersecurity Expert",
      story:
        "USP's cybersecurity program gave me the skills to protect organizations from cyber threats. Today, I lead security operations for a Fortune 500 company. The practical labs and industry certifications were game-changers for my career.",
      date: "2023-12-15",
    },
  ]);

  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [newStory, setNewStory] = useState({
    name: "",
    batch: "",
    role: "",
    story: "",
  });

  // Handler for adding new story (will connect to backend API)
  const handleAddStory = async () => {
    // TODO: Add API call to backend
    // const response = await fetch('/api/stories', {
    //   method: 'POST',
    //   body: JSON.stringify(newStory)
    // });

    // For now, just add to local state
    const story = {
      id: stories.length + 1,
      ...newStory,
      avatar: "/default-avatar.jpg",
      date: new Date().toISOString().split("T")[0],
    };

    setStories([story, ...stories]);
    setNewStory({ name: "", batch: "", role: "", story: "" });
    setShowAddStoryModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStory((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="success-stories">
      {/* Hero Section */}
      <div className="success-stories-hero">
        <div className="success-stories-hero-content">
          <h1 className="success-stories-title">Alumni Success Stories</h1>
          <p className="success-stories-subtitle">
            Inspiring journeys of our graduates making an impact around the
            world
          </p>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="success-stories-container">
        <div className="success-stories-grid">
          {stories.map((story) => (
            <article key={story.id} className="story-card">
              <div className="story-card-header">
                <div className="story-avatar-wrapper">
                  {story.avatar ? (
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="story-avatar"
                    />
                  ) : (
                    <div className="story-avatar-placeholder">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M16 20c0-4-8-4-8 0" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="story-card-info">
                  <h3 className="story-name">{story.name}</h3>
                  <p className="story-meta">
                    {story.role} • Batch {story.batch}
                  </p>
                </div>
              </div>

              <div className="story-card-body">
                <p className="story-text">{story.story}</p>
              </div>

              <div className="story-card-footer">
                <span className="story-date">
                  {new Date(story.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Add Story Button */}
        <div className="add-story-section">
          <button
            className="add-story-button"
            onClick={() => setShowAddStoryModal(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Your Story
          </button>
        </div>
      </div>

      {/* Add Story Modal */}
      {showAddStoryModal && (
        <div className="modal-overlay" onClick={() => setShowAddStoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Share Your Success Story</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddStoryModal(false)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newStory.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Batch Year</label>
                  <input
                    type="text"
                    name="batch"
                    value={newStory.batch}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 2020"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Current Role</label>
                  <input
                    type="text"
                    name="role"
                    value={newStory.role}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Story</label>
                <textarea
                  name="story"
                  value={newStory.story}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="6"
                  placeholder="Share your journey, achievements, and how USP helped you succeed..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-button modal-button-cancel"
                onClick={() => setShowAddStoryModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-submit"
                onClick={handleAddStory}
              >
                Submit Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}