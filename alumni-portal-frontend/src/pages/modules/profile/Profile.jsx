import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../../api/axios";
import {
  Upload,
  User,
  Pencil,
  X,
  Save,
  Briefcase,
  GraduationCap,
  Loader}
   from "lucide-react";
import "./Profile.css";

// Avatar Component
function ProfileAvatar({ avatar, name, isEditing, onImageUpload, uploading }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndUpload = async (file) => {
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
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should not exceed 5MB");
      return;
    }
    await onImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!isEditing) return;
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  };

  return (
    <div
      className="profile-avatar-container"
      onDragOver={(e) => {
        e.preventDefault();
        if (isEditing) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <motion.div
        whileHover={isEditing ? { scale: 1.05 } : {}}
        className={`profile-avatar-wrapper ${isEditing ? "editable" : ""} ${
          dragOver ? "drag-over" : ""
        }`}
        onClick={() => isEditing && fileInputRef.current?.click()}
      >
        {avatar ? (
          <img src={avatar} alt={name} className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">
            <User size={70} />
          </div>
        )}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="profile-avatar-overlay"
            >
              {uploading ? (
                <div className="upload-spinner" />
              ) : (
                <Upload size={24} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {isEditing && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="profile-avatar-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <div className="upload-spinner-small" />
            ) : (
              <Upload size={14} />
            )}
          </motion.button>
        )}
      </AnimatePresence>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) validateAndUpload(file);
        }}
        style={{ display: "none" }}
      />
    </div>
  );
}

// Field Component
function ProfileField({
  label,
  field,
  value,
  isEditing,
  onChange,
  type = "text",
  step,
  isLink,
}) {
  return (
    <div className="profile-field">
      <span className="profile-label">{label}</span>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <input
              type={type}
              name={field}
              step={step}
              value={value || ""}
              onChange={(e) => onChange(e)}
              className="profile-input"
              placeholder={`Enter your ${label.toLowerCase()}...`}
            />
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {isLink ? (
              <a
                href={value?.startsWith("http") ? value : `https://${value}`}
                className="profile-link"
                target="_blank"
                rel="noreferrer"
              >
                {value || "Add LinkedIn"}
              </a>
            ) : (
              <span className="profile-value">{value || "N/A"}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Profile Component
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    degree: "",
    semester: "",
    cgpa: "",
    careerGoals: "",
    interests: "",
    location: "",
  });
  const [originalProfile, setOriginalProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        const payload = res.data.data;
        const { user, profile: roleData } = payload;

        const profileData = {
          name: user?.fullName || "N/A",
          role: user?.role || "N/A",
          batch:
            user?.role === "student"
              ? roleData?.batch || "N/A"
              : roleData?.graduationYear || "N/A",
          department: roleData?.department || "N/A",
          about: roleData?.about || "",
          company: roleData?.company || "",
          jobTitle: roleData?.jobTitle || "",
          skills: Array.isArray(roleData?.skills)
            ? roleData.skills.join(", ")
            : "",
          linkedin: roleData?.linkedin || "",
          avatar: user?.profilePicture || "",
          degree: roleData?.degree || "",
          semester: roleData?.semester || "",
          cgpa: roleData?.cgpa || "",
          careerGoals: roleData?.careerGoals || "",
          interests:
            Array.isArray(roleData?.interests) && roleData.interests.length > 0
              ? roleData.interests.join(", ")
              : "",
          location: roleData?.location || "",
        };

        setProfile(profileData);
        setOriginalProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Failed to load profile data.");
      } finally {
        setLoading(false);
        setError(null);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const res = await API.post("/auth/upload-profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

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
        setOriginalProfile(profile);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Update failed.");
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const roleFields =
    profile.role === "alumni"
      ? [
          { field: "degree", label: "Degree" },
          { field: "company", label: "Company" },
          { field: "jobTitle", label: "Job Title" },
          { field: "linkedin", label: "LinkedIn", isLink: true },
          { field: "skills", label: "Skills" },
          { field: "location", label: "Location" },
        ]
      : [
          { field: "degree", label: "Degree" },
          { field: "semester", label: "Semester", type: "number", step: "0.01" },
          { field: "cgpa", label: "CGPA", type: "number", step: "0.01" },
          { field: "careerGoals", label: "Career Goals" },
          { field: "skills", label: "Skills" },
          { field: "interests", label: "Interests" },
        ];

  if (loading) {
    return (
      <div className="profile">
        <div className="profile-loading">
          <Loader className="loading-spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile">
        <div className="profile-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }
  return (
    <div className="profile">
      <div className="profile-container">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="profile-card profile-header-card">
            <div className="profile-header-content">
              <ProfileAvatar
                avatar={profile.avatar}
                name={profile.name}
                isEditing={isEditing}
                onImageUpload={handleImageUpload}
                uploading={uploadingImage}
              />
              <div className="profile-header-info">
                <div className="profile-title-row">
                  <h1 className="profile-name">{profile.name}</h1>
                  <span className="profile-badge">
                    {profile.role === "alumni" ? (
                      <Briefcase size={12} />
                    ) : (
                      <GraduationCap size={12} />
                    )}
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </span>
                </div>
                <div className="profile-metadata">
                  <div className="profile-metadata-item">
                    <span className="profile-metadata-label">
                      {profile.role === "student" ? "Batch" : "Graduation Year"}
                    </span>
                    <span className="profile-metadata-value">{profile.batch}</span>
                  </div>
                  <div className="profile-metadata-divider" />
                  <div className="profile-metadata-item">
                    <span className="profile-metadata-label">Department</span>
                    <span className="profile-metadata-value">{profile.department}</span>
                  </div>
                </div>
              </div>
              <div className="profile-header-actions">
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.button
                      key="edit-btn"
                      className="profile-btn profile-btn-outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil size={14} />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <motion.div key="save-btns" className="profile-btn-group">
                      <button
                        className="profile-btn profile-btn-outline"
                        onClick={handleCancel}
                      >
                        <X size={14} />
                        Cancel
                      </button>
                      <button
                        className="profile-btn profile-btn-primary"
                        onClick={handleSave}
                      >
                        <Save size={14} />
                        Save
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div className="profile-card">
            <h2 className="profile-section-title">About</h2>
            {isEditing ? (
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                rows={4}
                className="profile-textarea"
              />
            ) : (
              <p className="profile-text">{profile.about || "No bio added yet."}</p>
            )}
          </motion.div>

          <motion.div className="profile-card">
            <h2 className="profile-section-title">
              {profile.role === "student"
                ? "Academic Information"
                : "Professional Information"}
            </h2>
            <div className="profile-grid">
              {roleFields.map(({ field, label, isLink, type, step }) => (
                <ProfileField
                  key={field}
                  field={field}
                  label={label}
                  value={profile[field]}
                  isEditing={isEditing}
                  onChange={handleChange}
                  isLink={isLink}
                  type={type}
                  step={step}
                />
              ))}
            </div>
          </motion.div>

          <motion.div className="profile-mobile-actions">
            {isEditing ? (
              <div className="profile-mobile-btn-group">
                <button
                  className="profile-btn profile-btn-outline profile-btn-full"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="profile-btn profile-btn-primary profile-btn-full"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                className="profile-btn profile-btn-outline profile-btn-full"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
