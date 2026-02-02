import { useState, useEffect } from "react";
import API from "../../../api/axios";
import "./Profile.css";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    batch: "",
    department: "",
    about: "",
    company: "",
    jobTitle: "",
    skills: "",
    linkedin: "",
    avatar: "",
  });

  // 1. Fetch data on load
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      console.log("Profile Response Data:", res.data);
      const payload = res.data.data;

      if (!payload) {
        throw new Error("No data received from server");
      }

      const { user, profile: roleData } = payload;

      setProfile({
        name: user?.fullName || "N/A",
        role: user?.role || "N/A",
        batch: user?.role === "student" 
          ? (roleData?.batch || "N/A") 
          : (roleData?.graduationYear || "N/A"),
        department: roleData?.department || "N/A",
        about: roleData?.about || "No bio added yet.",
        company: roleData?.company || "",
        jobTitle: roleData?.jobTitle || "",
        skills: Array.isArray(roleData?.skills) ? roleData.skills.join(", ") : "", 
        linkedin: roleData?.linkedin || "",
        avatar: user?.profilePicture || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      const errorMsg = err.response?.data?.message || "Failed to load profile data.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Save logic to Backend
  const handleSave = async () => {
  try {
    const payload = {
      about: profile.about,
      company: profile.company,
      jobTitle: profile.jobTitle, // Changed from job_title
      linkedin: profile.linkedin,
      skills: profile.skills ? profile.skills.split(",").map(s => s.trim()) : []
    };

    const res = await API.put("/auth/update-profile", payload);

    if (res.data.success) {
      alert("Profile updated successfully!");
      setIsEditing(false);
    }
  } catch (err) {
    console.error("Update Error:", err);
    alert("Update failed: " + (err.response?.data?.message || "Server error"));
  }
};

  const handleCancel = () => setIsEditing(false);

  if (loading) return (
  <div className="profile-loader-container">
    <div className="spinner"></div>
    <p>Fetching your profile...</p>
  </div>
);

  return (
    <div className="alumni-profile">
      <div className="alumni-profile-container">
        {/* Header */}
        <div className="alumni-profile-header">
          <div className="alumni-profile-avatar-wrapper">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="alumni-profile-avatar" />
            ) : (
              <div className="alumni-profile-avatar-placeholder">
                <svg width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M16 20c0-4-8-4-8 0" />
                </svg>
              </div>
            )}
          </div>

          <div className="alumni-profile-header-info">
            <div className="alumni-profile-title-row">
              <h1 className="alumni-profile-name">{profile.name}</h1>
              <span className="alumni-profile-badge">{profile.role}</span>
            </div>
            <div className="alumni-profile-metadata">
              <div className="alumni-profile-metadata-item">
                <span className="alumni-profile-metadata-label">{profile.role === 'student' ? 'Batch' : 'Grad Year'}</span>
                <span className="alumni-profile-metadata-value">{profile.batch}</span>
              </div>
              <div className="alumni-profile-metadata-divider" />
              <div className="alumni-profile-metadata-item">
                <span className="alumni-profile-metadata-label">Department</span>
                <span className="alumni-profile-metadata-value">{profile.department}</span>
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
            <h2 className="alumni-profile-section-title">Professional Information</h2>
            <div className="alumni-profile-section-content">
              <div className="alumni-profile-grid">
                {["company", "jobTitle", "skills", "linkedin"].map((field) => (
                  <div className="alumni-profile-field" key={field}>
                    <label className="alumni-profile-label">
                      {field === "jobTitle" ? "Job Title" : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {isEditing ? (
                      <input
                        type={field === "linkedin" ? "url" : "text"}
                        name={field}
                        value={profile[field]}
                        onChange={handleChange}
                        className="alumni-profile-input"
                      />
                    ) : field === "linkedin" ? (
                      <a href={profile[field]} className="alumni-profile-link" target="_blank" rel="noreferrer">
                        {profile[field] || "Add LinkedIn"}
                      </a>
                    ) : (
                      <span className="alumni-profile-value">{profile[field] || "N/A"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="alumni-profile-actions">
            {isEditing ? (
              <>
                <button className="alumni-profile-buttons alumni-profile-buttons-secondary" onClick={handleCancel}>Cancel</button>
                <button className="alumni-profile-buttons alumni-profile-buttons-primary" onClick={handleSave}>Save Changes</button>
              </>
            ) : (
              <button className="alumni-profile-buttons alumni-profile-buttons-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}