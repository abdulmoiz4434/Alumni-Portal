import { useState, useEffect } from "react";
import { User, Calendar, Trash2, Plus, Send, CheckCircle } from "lucide-react";
import API from "../../../api/axios";
import "./Mentorship.css";

export default function Mentorship() {
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [filterField, setFilterField] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Application State
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [sentApplications, setSentApplications] = useState([]);

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
      setUserId(user.id || user._id);
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

  // NEW: Handle sending the mentorship application
  const handleApplySubmit = async () => {
    if (!applyMessage.trim()) return alert("Please enter a message for the mentor.");

    try {
      const res = await API.post("/mentorship/apply", {
        alumnusId: selectedMentor.postedBy._id,
        message: applyMessage
      });

      if (res.data.success) {
        setSentApplications([...sentApplications, selectedMentor._id]);
        alert("Application sent! The mentor will be notified.");
        setShowApplyModal(false);
        setApplyMessage("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send application");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this mentorship?")) {
      try {
        const res = await API.delete(`/mentorship/${id}`);
        if (res.data.success) {
          alert("Mentorship removed successfully");
          setMentorships(mentorships.filter((m) => m._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete");
      }
    }
  };

  const canDeleteMentorship = (postedBy) => {
    const ownerId = postedBy._id || postedBy;
    if (userRole === "admin") return true;
    if (userRole === "alumni" && userId === ownerId) return true;
    return false;
  };

  const fields = ["All", ...new Set(mentorships.map((m) => m.field))];

  const filteredMentorships = mentorships.filter((m) => {
    const matchesField = filterField === "All" || m.field === filterField;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      m.title.toLowerCase().includes(search) ||
      m.postedByName.toLowerCase().includes(search) ||
      m.description.toLowerCase().includes(search);

    return matchesField && matchesSearch;
  });

  const handleNewFormChange = (e) => {
    const { name, value } = e.target;
    setNewMentorshipForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOfferSubmit = async () => {
    try {
      const res = await API.post("/mentorship", {
        ...newMentorshipForm,
        skills: newMentorshipForm.skills.split(",").map((s) => s.trim()),
      });

      if (res.data.success) {
        alert("Mentorship posted successfully!");
        setNewMentorshipForm({ title: "", field: "", duration: "", description: "", skills: "" });
        setShowOfferModal(false);
        fetchMentorships();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post mentorship");
    }
  };

  if (loading) return <div className="events-loader-container"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="mentorship">
      <div className="mentorship-hero">
        <div className="mentorship-hero-content">
          <h1 className="main-title">Mentorship Program</h1>
          <p className="subtitle">Connect with experienced alumni who are ready to guide you.</p>
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
            <input
              type="text"
              placeholder="Search by title, mentor, or skills..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <select className="filter-select" value={filterField} onChange={(e) => setFilterField(e.target.value)}>
              {fields.map((field) => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="opportunities-grid">
          {filteredMentorships.map((mentorship) => {
            const isApplied = sentApplications.includes(mentorship._id);
            return (
              <div key={mentorship._id} className="opportunity-card">
                {canDeleteMentorship(mentorship.postedBy) && (
                  <button className="mentorship-delete-btn" onClick={() => handleDelete(mentorship._id)}>
                    <Trash2 size={18} />
                  </button>
                )}

                <div className="card-header">
                  <div className="card-meta">
                    <span className="badge">{mentorship.field}</span>
                    <span className="posted-date">{new Date(mentorship.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="job-title">{mentorship.title}</h2>
                  <p className="company-name"><User size={18} /> {mentorship.postedByName}</p>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="info-item"><Calendar size={20} /> {mentorship.duration}</span>
                  </div>
                  <p className="description">{mentorship.description}</p>
                  
                  {mentorship.skills?.length > 0 && (
                    <div className="skills-container">
                      {mentorship.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}

                  <div className="card-actions">
                    {userRole === "student" && (
                      <button
                        className={`btn-primary ${isApplied ? "applied" : ""}`}
                        disabled={isApplied}
                        onClick={() => {
                          setSelectedMentor(mentorship);
                          setShowApplyModal(true);
                        }}
                      >
                        {isApplied ? <><CheckCircle size={18} /> Applied</> : "Apply for Mentorship"}
                      </button>
                    )}
                    {userRole === "alumni" && userId === (mentorship.postedBy._id || mentorship.postedBy) && (
                      <span className="own-post-tag">Your Offering</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW: Application Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply to {selectedMentor?.postedByName}</h2>
              <button onClick={() => setShowApplyModal(false)} className="close-modal-btn">×</button>
            </div>
            <div className="modal-body">
              <label>Introduce yourself and explain why you're seeking mentorship:</label>
              <textarea
                className="apply-textarea"
                rows="5"
                placeholder="Write your message here..."
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="event-btn-cancel" onClick={() => setShowApplyModal(false)}>Cancel</button>
              <button className="event-btn-submit" onClick={handleApplySubmit}>
                <Send size={18} /> Send Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Mentorship Modal */}
      {showOfferModal && (
        <div className="modal-overlay" onClick={() => setShowOfferModal(false)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Offer Mentorship</h2>
              <button onClick={() => setShowOfferModal(false)} className="close-modal-btn">×</button>
            </div>

            <form className="form-grid" onSubmit={(e) => { e.preventDefault(); handleOfferSubmit(); }}>
              <div className="form-group">
                <label>Mentorship Title *</label>
                <input type="text" name="title" value={newMentorshipForm.title} onChange={handleNewFormChange} required />
              </div>
              <div className="form-group">
                <label>Field *</label>
                <input type="text" name="field" value={newMentorshipForm.field} onChange={handleNewFormChange} required />
              </div>
              <div className="form-group">
                <label>Duration *</label>
                <input type="text" name="duration" value={newMentorshipForm.duration} onChange={handleNewFormChange} required />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Description *</label>
                <textarea name="description" value={newMentorshipForm.description} onChange={handleNewFormChange} rows="4" required />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Skills (comma separated) *</label>
                <input type="text" name="skills" value={newMentorshipForm.skills} onChange={handleNewFormChange} required />
              </div>
              <div className="modal-footer" style={{ gridColumn: "1 / -1" }}>
                <button type="button" className="event-btn-cancel" onClick={() => setShowOfferModal(false)}>Cancel</button>
                <button type="submit" className="event-btn-submit">Post Mentorship</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}