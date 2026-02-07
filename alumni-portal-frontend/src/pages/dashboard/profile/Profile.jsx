import { useState, useEffect, useRef } from "react";
import API from "../../../api/axios";
import {
  Upload, 
} from "lucide-react";
import "./Profile.css";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
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
          batch:
            user?.role === "student"
              ? roleData?.batch || "N/A"
              : roleData?.graduationYear || "N/A",
          department: roleData?.department || "N/A",
          about: roleData?.about || "No bio added yet.",
          company: roleData?.company || "",
          jobTitle: roleData?.jobTitle || "",
          skills: Array.isArray(roleData?.skills)
            ? roleData.skills.join(", ")
            : "",
          linkedin: roleData?.linkedin || "",
          avatar: user?.profilePicture || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to load profile data.";
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

  // 2. Handle profile picture upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, GIF, or WEBP)");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert("Image size should not exceed 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await API.post("/auth/upload-profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setProfile((prev) => ({
          ...prev,
          avatar: res.data.data.profilePicture,
        }));
        alert("Profile picture updated successfully!");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert(
        "Failed to upload image: " +
          (err.response?.data?.message || "Server error"),
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // 3. Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 4. Save logic to Backend
  const handleSave = async () => {
    try {
      let payload = {
        about: profile.about,
        degree: profile.degree,
        skills: profile.skills
          ? profile.skills.split(",").map((s) => s.trim())
          : [],
      };

      if (profile.role === "alumni") {
        payload = {
          ...payload,
          linkedin: profile.linkedin,
          company: profile.company,
          jobTitle: profile.jobTitle,
          location: profile.location,
        };
      } else {
        payload = {
          ...payload,
          semester: profile.semester,
          cgpa: profile.cgpa,
          careerGoals: profile.careerGoals,
          interests: profile.interests,
        };
      }

      const res = await API.put("/auth/update-profile", payload);

      if (res.data.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert(
        "Update failed: " + (err.response?.data?.message || "Server error"),
      );
    }
  };

  const handleCancel = () => setIsEditing(false);

  if (loading)
    return (
      <div className="profile-loader-container">
        <div className="spinner"></div>
        <p>Fetching your profile...</p>
      </div>
    );

  return (
    <div className="profile">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <svg
                  width="50%"
                  height="50%"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M16 20c0-4-8-4-8 0" />
                </svg>
              </div>
            )}

            {/* Upload Button - Only show when editing */}
            {isEditing && (
              <button
                className="profile-avatar-upload"
                onClick={handleAvatarClick}
                disabled={uploadingImage}
                title="Upload profile picture"
              >
                {uploadingImage ? (
                  <div className="upload-spinner"></div>
                ) : (
<Upload size={18} />
                )}
              </button>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>

          <div className="profile-header-info">
            <div className="profile-title-row">
              <h1 className="profile-name">{profile.name}</h1>
              <span className="profile-badge">{profile.role}</span>
            </div>
            <div className="profile-metadata">
              <div className="profile-metadata-item">
                <span className="profile-metadata-label">
                  {profile.role === "student" ? "Batch" : "Grad Year"}
                </span>
                <span className="profile-metadata-value">
                  {profile.batch}
                </span>
              </div>
              <div className="profile-metadata-divider" />
              <div className="profile-metadata-item">
                <span className="profile-metadata-label">
                  Department
                </span>
                <span className="profile-metadata-value">
                  {profile.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="profile-content">
          <section className="profile-section">
            <h2 className="profile-section-title">About</h2>
            <div className="profile-section-content">
              {isEditing ? (
                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleChange}
                  className="profile-textarea"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="profile-text">{profile.about}</p>
              )}
            </div>
          </section>

          <section className="profile-section">
            <h2 className="profile-section-title">
              {profile.role === "student"
                ? "Academic Information"
                : "Professional Information"}
            </h2>
            <div className="profile-section-content">
              <div className="profile-grid">
                {/* 1. Define fields based on role */}
                {(profile.role === "alumni"
                  ? [
                      "degree",
                      "company",
                      "jobTitle",
                      "linkedin",
                      "skills",
                      "location",
                    ]
                  : [
                      "degree",
                      "semester",
                      "cgpa",
                      "careerGoals",
                      "skills",
                      "interests",
                    ]
                ).map((field) => (
                  <div className="profile-field" key={field}>
                    <label className="profile-label">
                      {/* Helper to format camelCase to Title Case */}
                      {field === "jobTitle"
                        ? "Job Title"
                        : field === "careerGoals"
                          ? "Career Goals"
                          : field === "cgpa"
                            ? "CGPA"
                            : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>

                    {isEditing ? (
                      <input
                        type={
                          field === "linkedin"
                            ? "url"
                            : field === "cgpa"
                              ? "number"
                              : "text"
                        }
                        name={field}
                        step={field === "cgpa" ? "0.01" : "1"}
                        value={profile[field]}
                        onChange={handleChange}
                        className="profile-input"
                        placeholder={`Enter your ${field}...`}
                      />
                    ) : field === "linkedin" ? (
                      <a
                        href={
                          profile[field]?.startsWith("http")
                            ? profile[field]
                            : `https://${profile[field]}`
                        }
                        className="profile-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {profile[field] || "Add LinkedIn"}
                      </a>
                    ) : (
                      <span className="-profile-value">
                        {profile[field] || "N/A"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button
                  className="profile-buttons profile-buttons-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="profile-buttons profile-buttons-primary"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                className="profile-buttons profile-buttons-primary"
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
