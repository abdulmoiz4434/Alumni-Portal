import { useState } from "react";
import "./Profile.css";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Ghulam Ahmad",
    role: "Alumni",
    batch: "2022",
    department: "Computer Science",
    about:
      "Passionate jews and women hater.",
    company: "ABC Technologies",
    jobTitle: "Frontend Developer",
    skills: "React, JavaScript, CSS, UI/UX",
    linkedin: "https://linkedin.com/in/ghulamahmad",
    avatar: "/download.jpg",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  return (
    <div className="alumni-profile">
      <div className="alumni-profile-container">
        {/* Header */}
        <div className="alumni-profile-header">
          <div className="alumni-profile-avatar-wrapper">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={`${profile.name}`}
                className="alumni-profile-avatar"
              />
            ) : (
              <div className="alumni-profile-avatar-placeholder">
                <svg
                  width="50%"
                  height="50%"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M16 20c0-4-8-4-8 0" />
                </svg>
              </div>
            )}
            {isEditing && (
              <button className="alumni-profile-avatar-upload">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 10v2.667A1.333 1.333 0 0112.667 14H3.333A1.333 1.333 0 012 12.667V10m9.333-5.333L8 1.333m0 0L4.667 4.667M8 1.333v9.334"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="alumni-profile-header-info">
            <div className="alumni-profile-title-row">
              <h1 className="alumni-profile-name">{profile.name}</h1>
              <span className="alumni-profile-badge">{profile.role}</span>
            </div>
            <div className="alumni-profile-metadata">
              <div className="alumni-profile-metadata-item">
                <span className="alumni-profile-metadata-label">Batch</span>
                <span className="alumni-profile-metadata-value">
                  {profile.batch}
                </span>
              </div>
              <div className="alumni-profile-metadata-divider" />
              <div className="alumni-profile-metadata-item">
                <span className="alumni-profile-metadata-label">
                  Department
                </span>
                <span className="alumni-profile-metadata-value">
                  {profile.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="alumni-profile-content">
          <section className="alumni-profile-section">
            <h2 className="alumni-profile-section-title">About</h2>
            <div className="alumni-profile-section-content">
              {isEditing ? (
                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleChange}
                  className="alumni-profile-textarea"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="alumni-profile-text">{profile.about}</p>
              )}
            </div>
          </section>

          <section className="alumni-profile-section">
            <h2 className="alumni-profile-section-title">
              Professional Information
            </h2>
            <div className="alumni-profile-section-content">
              <div className="alumni-profile-grid">
                {["company", "jobTitle", "skills", "linkedin"].map((field) => (
                  <div className="alumni-profile-field" key={field}>
                    <label className="alumni-profile-label">
                      {field === "jobTitle"
                        ? "Job Title"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {isEditing ? (
                      <input
                        type={field === "linkedin" ? "url" : "text"}
                        name={field}
                        value={profile[field]}
                        onChange={handleChange}
                        className="alumni-profile-input"
                        placeholder={`Enter ${field}`}
                      />
                    ) : field === "linkedin" ? (
                      <a
                        href={profile[field]}
                        className="alumni-profile-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {profile[field]}
                      </a>
                    ) : (
                      <span className="alumni-profile-value">
                        {profile[field]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Buttons */}
          <div className="alumni-profile-actions">
            {isEditing ? (
              <>
                <button
                  className="alumni-profile-buttons alumni-profile-buttons-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="alumni-profile-buttons alumni-profile-buttons-primary"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                className="alumni-profile-buttons alumni-profile-buttons-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}