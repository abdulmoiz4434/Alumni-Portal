import "./Profile.css";

export default function Profile() {
  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="/default-avatar.png" alt="Profile" />
        </div>

        <div className="profile-basic-info">
          <h2>Ghulam Ahmad</h2>
          <p className="profile-role">Alumni</p>
          <p className="profile-meta">
            Batch 2021 · Computer Science
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="profile-content">
        {/* About */}
        <div className="profile-card">
          <h3>About</h3>
          <p>
            Passionate software developer and proud alumni of the University of
            Southern Punjab. Interested in mentoring students and contributing
            to the alumni network.
          </p>
        </div>

        {/* Professional Info */}
        <div className="profile-card">
          <h3>Professional Information</h3>

          <div className="profile-info-grid">
            <div>
              <label>Current Company</label>
              <span>ABC Technologies</span>
            </div>

            <div>
              <label>Job Title</label>
              <span>Frontend Developer</span>
            </div>

            <div>
              <label>Skills</label>
              <span>React, JavaScript, CSS, UI/UX</span>
            </div>

            <div>
              <label>LinkedIn</label>
              <a href="#" className="profile-link">
                linkedin.com/in/ghulamahmad
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button className="profile-edit-btn">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
