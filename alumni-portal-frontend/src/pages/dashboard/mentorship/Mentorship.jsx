import { useState, useEffect } from "react";
import { User, Calendar, X, Search, Plus, Trash2 } from "lucide-react";
import API from "../../../api/axios";
import "./Mentorship.css";

export default function Mentorship() {
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  
  const [filterField, setFilterField] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
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
    field: "",
    duration: "",
    description: "",
    skills: "",
  });

  useEffect(() => {
    fetchUserProfile();
    fetchMentorships();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      const { user } = res.data.data;
      setUserRole(user.role);
      setUserId(user.id);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchMentorships = async () => {
    try {
      setLoading(true);
      const res = await API.get("/mentorship");
      if (res.data.success) {
        setMentorships(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching mentorships:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this mentorship?")) {
      try {
        const res = await API.delete(`/mentorship/${id}`);
        if (res.data.success) {
          alert("Mentorship removed successfully");
          setMentorships(mentorships.filter(m => m._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete");
      }
    }
  };

  const canDeleteMentorship = (postedBy) => {
    if (userRole === "admin") return true;
    if (userRole === "alumni" && userId === postedBy._id) return true;
    return false;
  };

  const fields = ["All", ...new Set(mentorships.map((m) => m.field))];

  // Combined filtering logic
  const filteredMentorships = mentorships.filter((m) => {
    const matchesField = filterField === "All" || m.field === filterField;
    const matchesSearch = 
      searchTerm === "" ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.postedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.skills && m.skills.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    return matchesField && matchesSearch;
  });

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

  const handleSubmit = async () => {
    try {
      const res = await API.post("/mentorship-applications", {
        mentorshipId: selectedMentorship._id,
        ...applicationForm,
      });

      if (res.data.success) {
        alert("Application submitted successfully!");
        setApplicationForm({
          name: "",
          email: "",
          batch: "",
          goals: "",
          experience: "",
        });
        setShowConnectModal(false);
        setSelectedMentorship(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit application");
    }
  };

  const handleOfferSubmit = async () => {
    if (userRole !== "alumni") {
      alert("Only alumni can offer mentorship");
      return;
    }

    try {
      const res = await API.post("/mentorship", {
        title: newMentorshipForm.title,
        field: newMentorshipForm.field,
        duration: newMentorshipForm.duration,
        description: newMentorshipForm.description,
        skills: newMentorshipForm.skills
          .split(",")
          .map((s) => s.trim()),
      });

      if (res.data.success) {
        alert("Mentorship posted successfully!");
        setNewMentorshipForm({
          title: "",
          field: "",
          duration: "",
          description: "",
          skills: "",
        });
        setShowOfferModal(false);
        fetchMentorships();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post mentorship");
    }
  };

  if (loading) {
    return (
      <div className="events-loader-container">
        <div className="spinner"></div>
        <p>Loading mentorships...</p>
      </div>
    );
  }

  return (
    <div className="mentorship">
      <div className="mentorship-hero">
        <div className="mentorship-hero-content">
          <h1 className="main-title">Mentorship Program</h1>
          <p className="subtitle">
            Connect with experienced alumni who are ready to guide you on your career journey
          </p>
          {userRole === "alumni" && (
            <button className="create-mentorship-btn-hero" onClick={() => setShowOfferModal(true)}>
              <Plus size={20} /> Offer Mentorship
            </button>
          )}
        </div>
      </div>

      <div className="mentorship-container">
        <div className="search-filter-section">
          <div className="search-box">
            <Search size={22} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, mentor name, skills..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <select 
              className="filter-select"
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
            >
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="opportunities-grid">
          {filteredMentorships.length === 0 ? (
            <div className="no-results">
              <User size={64} color="#E0E0E0" />
              <h3>No mentorships found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredMentorships.map((mentorship) => (
              <div key={mentorship._id} className="opportunity-card">
                {canDeleteMentorship(mentorship.postedBy) && (
                  <button className="mentorship-delete-btn" onClick={() => handleDelete(mentorship._id)}>
                    <Trash2 size={18} />
                  </button>
                )}

                <div className="card-header">
                  <div className="card-meta">
                    <span className="badge">{mentorship.field}</span>
                    <span className="posted-date">
                      {new Date(mentorship.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="job-title">{mentorship.title}</h2>
                  <p className="company-name">
                    <User size={18} /> {mentorship.postedByName}
                  </p>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="info-item">
                      <Calendar size={20} /> {mentorship.duration}
                    </span>
                  </div>

                  <p className="description">{mentorship.description}</p>

                  {mentorship.skills && mentorship.skills.length > 0 && (
                    <div className="skills-container">
                      {mentorship.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="card-footer">
                    <div className="mentorship-type">
                      <span>1-on-1 Mentorship</span>
                    </div>
                    <span className="posted-by">
                      By {mentorship.postedByName || "Alumni"}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn-primary"
                    onClick={() => handleConnect(mentorship)}
                  >
                    Connect With Mentor
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && selectedMentorship && (
        <div
          className="modal-overlay"
          onClick={() => setShowConnectModal(false)}
        >
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Apply for Mentorship</h2>
                <p style={{ margin: "5px 0 0 0", fontSize: "0.95rem", color: "#64748b" }}>
                  {selectedMentorship.title} - {selectedMentorship.postedByName}
                </p>
              </div>
              <button onClick={() => setShowConnectModal(false)} className="close-modal-btn">
                <X size={24} />
              </button>
            </div>
            
            <form className="form-grid" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={applicationForm.name}
                  onChange={handleFormChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={applicationForm.email}
                  onChange={handleFormChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Batch Year *</label>
                <input
                  type="text"
                  name="batch"
                  value={applicationForm.batch}
                  onChange={handleFormChange}
                  placeholder="e.g., 2023"
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Your Goals *</label>
                <textarea
                  name="goals"
                  value={applicationForm.goals}
                  onChange={handleFormChange}
                  rows="4"
                  placeholder="What do you hope to achieve through this mentorship?"
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Current Experience & Background</label>
                <textarea
                  name="experience"
                  value={applicationForm.experience}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Tell us about your current skills and experience..."
                />
              </div>

              <div className="modal-footer" style={{ gridColumn: "1 / -1" }}>
                <button type="button" className="event-btn-cancel" onClick={() => setShowConnectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="event-btn-submit">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Mentorship Modal */}
      {showOfferModal && (
        <div className="modal-overlay" onClick={() => setShowOfferModal(false)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Offer Mentorship</h2>
              <button onClick={() => setShowOfferModal(false)} className="close-modal-btn">
                <X size={24} />
              </button>
            </div>

            <form className="form-grid" onSubmit={(e) => { e.preventDefault(); handleOfferSubmit(); }}>
              <div className="form-group">
                <label>Mentorship Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. React & Frontend Career Guidance"
                  value={newMentorshipForm.title}
                  onChange={handleNewFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Field *</label>
                <input
                  type="text"
                  name="field"
                  placeholder="e.g. Frontend Development"
                  value={newMentorshipForm.field}
                  onChange={handleNewFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration *</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 3 months"
                  value={newMentorshipForm.duration}
                  onChange={handleNewFormChange}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Description *</label>
                <textarea
                  name="description"
                  placeholder="Briefly describe what mentees will learn and how you will guide them"
                  value={newMentorshipForm.description}
                  onChange={handleNewFormChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Skills (comma separated) *</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React, JavaScript, UI/UX, Career Planning"
                  value={newMentorshipForm.skills}
                  onChange={handleNewFormChange}
                  required
                />
              </div>

              <div className="modal-footer" style={{ gridColumn: "1 / -1" }}>
                <button type="button" className="event-btn-cancel" onClick={() => setShowOfferModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="event-btn-submit">
                  Post Mentorship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}