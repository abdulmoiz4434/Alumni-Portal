import { useState, useEffect } from "react";
import API from "../../../api/axios";
import {
  Search,
  Building2,
  MapPin,
  Info,
  Briefcase,
  Plus,
  Loader,
  Trash2,
  X
} from "lucide-react";
import { Toast, useToast } from "../Profile/Toast";
import "./Jobs.css";

// Confirm Dialog Component
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn confirm-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Jobs() {
  // 1. Data State
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  // 2. Form State
  const [formData, setFormData] = useState({
    category: "job",
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "full-time",
    description: "",
    deadline: "",
    requirements: "",
    contactEmail: ""
  });

  // 3. Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchJobs();
    fetchUserProfile();
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

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      if (res.data.success) {
        setOpportunities(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || "Failed to load opportunities.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/jobs", formData);
      if (res.data.success) {
        addToast("Opportunity posted successfully!", "success");
        setIsModalOpen(false);
        setFormData({
          category: "job", title: "", company: "", location: "",
          salary: "", jobType: "full-time", description: "",
          deadline: "", requirements: "", contactEmail: ""
        });
        fetchJobs();
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to post opportunity.", "error");
    }
  };

  const handleDelete = (id) => {
    setConfirmDialog({ id });
  };

  const confirmDelete = async () => {
    const { id } = confirmDialog;
    setConfirmDialog(null);
    try {
      const res = await API.delete(`/jobs/${id}`);
      if (res.data.success) {
        setOpportunities((prev) => prev.filter((op) => op._id !== id));
        addToast("Opportunity removed successfully.", "success");
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to delete opportunity.", "error");
    }
  };

  const canDeleteJob = (postedBy) => {
    if (userRole === "admin") return true;
    if (userRole === "alumni" && userId === postedBy._id) return true;
    return false;
  };

  // Filter Logic
  const filteredOpportunities = opportunities.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      filterLocation === "all" ||
      item.location.toLowerCase().includes(filterLocation.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "jobs" && item.category === "job") ||
      (activeTab === "internships" && item.category === "internship");

    return matchesSearch && matchesLocation && matchesTab;
  });

  if (loading) {
    return (
      <div className="jobs">
        <div className="jobs-loading">
          <Loader className="loading-spinner" />
          <p>Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs">
        <div className="jobs-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs">
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this opportunity? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      <div className="jobs-hero">
        <div className="jobs-hero-content">
          <h1 className="main-title">Career Opportunities</h1>
          <p className="subtitle">Explore jobs and internships posted by our network</p>

          {(userRole === "admin" || userRole === "alumni") && (
            <button className="create-job-btn-hero" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} /> Post an Opportunity
            </button>
          )}
        </div>
      </div>

      <div className="jobs-container">
        <div className="jobs-search-filter-section">
          <div className="search-box">
            <Search size={22} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Locations</option>
              <option value="remote">Remote</option>
              <option value="lahore">Lahore</option>
              <option value="karachi">Karachi</option>
            </select>

            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="tab-select"
            >
              <option value="all">All Opportunities</option>
              <option value="jobs">Jobs</option>
              <option value="internships">Internships</option>
            </select>
          </div>
        </div>

        <div className="opportunities-grid">
          {filteredOpportunities.length === 0 ? (
            <div className="no-results">
              <Briefcase size={64} color="#E0E0E0" />
              <h3>No opportunities found</h3>
            </div>
          ) : (
            filteredOpportunities.map((item) => (
              <div key={item._id} className={`opportunity-card ${item.category}`}>
                {canDeleteJob(item.postedBy) && (
                  <button
                    className="job-delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <div className="card-header">
                  <div className="card-meta">
                    <span className={`badge ${item.category}`}>{item.category}</span>
                    <span className="job-posted-date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="job-title">{item.title}</h2>
                  <p className="company-name">
                    <Building2 size={18} /> {item.company}
                  </p>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="info-item"><MapPin size={20} /> {item.location}</span>
                    <span className="info-item">
                      <Briefcase size={20} />
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                  </div>
                  <p className="description">{item.description}</p>
                  <div className="card-footer">
                    <div className="salary-info">
                      <Info size={20} />
                      <span>{item.salary || "Not Specified"}</span>
                    </div>
                    <span className="posted-by">By {item.postedByName || "Admin"}</span>
                  </div>
                  <div className="contact-email-section">
                    <p className="contact-label">Send CV to:</p>
                    {item.contactEmail ? (
                      <p className="email-link">{item.contactEmail}</p>
                    ) : (
                      <p className="email-missing">Email not provided</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Post Opportunity Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="event-modal">
            <div className="modal-header">
              <h2>Post New Opportunity</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">
                <X size={24} />
              </button>
            </div>
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="filter-select"
                >
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  required
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  required
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Salary/Stipend</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  required
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  required
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Description</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer" style={{ gridColumn: "1 / -1" }}>
                <button
                  type="button"
                  className="event-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="event-btn-submit">
                  Post Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}