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
} from "lucide-react";
import "./Profile.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Skeleton Component
function ProfileSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="profile"
    >
      <div className="profile-container">
        <div className="profile-card profile-header-card">
          <div className="profile-header-content">
            <div className="skeleton skeleton-avatar" />
            <div className="profile-header-info">
              <div className="profile-title-row">
                <div className="skeleton skeleton-name" />
                <div className="skeleton skeleton-badge" />
              </div>
              <div className="profile-metadata">
                <div className="skeleton skeleton-meta" />
                <div className="skeleton skeleton-meta" />
              </div>
            </div>
          </div>
        </div>
        <div className="profile-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text-short" />
        </div>
        <div className="profile-card">
          <div className="skeleton skeleton-title" />
          <div className="profile-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="profile-field">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-value" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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
            <User size={48} />
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
                href={
                  value?.startsWith("http") ? value : `https://${value}`
                }
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

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me");
        const payload = res.data.data;

        if (!payload) {
          throw new Error("No data received from server");
        }

        const { user, profile: roleData } = payload;

        const profileData = {
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
          degree: roleData?.degree || "",
          semester: roleData?.semester || "",
          cgpa: roleData?.cgpa || "",
          careerGoals: roleData?.careerGoals || "",
          interests: Array.isArray(roleData?.interests) && roleData.interests.length > 0 ? roleData.interests.join(", ") : "",
          location: roleData?.location || "",
        };

        setProfile(profileData);
        setOriginalProfile(profileData);
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

  // Handle profile picture upload
  const handleImageUpload = async (file) => {
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
          (err.response?.data?.message || "Server error")
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // Save profile changes
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
      alert(
        "Update failed: " + (err.response?.data?.message || "Server error")
      );
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  // Define role-based fields
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
          { field: "semester", label: "Semester" },
          { field: "cgpa", label: "CGPA", type: "number", step: "0.01" },
          { field: "careerGoals", label: "Career Goals" },
          { field: "skills", label: "Skills" },
          { field: "interests", label: "Interests" },
        ];

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="profile">
      <div className="profile-container">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Header Card */}
          <motion.div
            variants={item}
            className="profile-card profile-header-card"
          >
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
                    {profile.role.charAt(0).toUpperCase() +
                      profile.role.slice(1)}
                  </span>
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
                    <span className="profile-metadata-label">Department</span>
                    <span className="profile-metadata-value">
                      {profile.department}
                    </span>
                  </div>
                </div>
              </div>
              {/* Desktop Edit Button */}
              <div className="profile-header-actions">
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.button
                      key="edit-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="profile-btn profile-btn-outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil size={14} />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <motion.div
                      key="save-btns"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="profile-btn-group"
                    >
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

          {/* About Section */}
          <motion.div variants={item} className="profile-card">
            <h2 className="profile-section-title">About</h2>
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <textarea
                    name="about"
                    value={profile.about}
                    onChange={handleChange}
                    rows={4}
                    className="profile-textarea"
                    placeholder="Tell us about yourself..."
                  />
                </motion.div>
              ) : (
                <motion.p
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="profile-text"
                >
                  {profile.about}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info Section */}
          <motion.div variants={item} className="profile-card">
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

          {/* Mobile Actions */}
          <motion.div variants={item} className="profile-mobile-actions">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="btns"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="profile-mobile-btn-group"
                >
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
                </motion.div>
              ) : (
                <motion.button
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="profile-btn profile-btn-outline profile-btn-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={14} />
                  Edit Profile
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}