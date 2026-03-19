import { useState, useEffect } from "react";
import { format, parseISO, isPast, isToday } from "date-fns";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaSearch,
  FaUserGraduate,
  FaUserTie,
  FaGlobe,
  FaTimesCircle,
  FaPlus,
} from "react-icons/fa";
import { Trash2, Loader } from "lucide-react";
import API from "../../../api/axios";
import { Toast, useToast } from "../Profile/Toast";
import "./Events.css";

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

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  // Create Event States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    category: "Workshop",
    date: "",
    time: "",
    venue: "",
    targetAudience: "all",
    capacity: "",
    organizer: "",
    contactEmail: "",
  });

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All Types",
    "Workshop",
    "Seminar",
    "Networking",
    "Career Fair",
    "Social",
    "Sports",
    "Cultural",
    "Academic",
    "Other",
  ];

  useEffect(() => {
    fetchEvents();
    fetchUserProfile();
  }, [selectedStatus]);

  const fetchUserProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      const { user } = res.data.data;
      setUserRole(user.role);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/events", {
        params: {
          status: selectedStatus || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery || undefined,
        },
      });
      setEvents(res.data.data);
      setFilteredEvents(res.data.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  // Filter events client-side
  useEffect(() => {
    let filtered = [...events];
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) => event.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (selectedAudience !== "all") {
      filtered = filtered.filter(
        (event) =>
          event.targetAudience === selectedAudience ||
          event.targetAudience === "all"
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredEvents(filtered);
  }, [selectedCategory, selectedAudience, searchQuery, events]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(newEvent).forEach((key) => {
      data.append(key, newEvent[key]);
    });
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const res = await API.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        addToast("Event created successfully!", "success");
        setShowCreateModal(false);
        setNewEvent({
          title: "", description: "", category: "Workshop", date: "",
          time: "", venue: "", targetAudience: "all", capacity: "",
          organizer: "", contactEmail: "",
        });
        setImageFile(null);
        fetchEvents();
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to create event.", "error");
    }
  };

  const handleDeleteEvent = (eventId) => {
    setConfirmDialog({ eventId });
  };

  const confirmDelete = async () => {
    const { eventId } = confirmDialog;
    setConfirmDialog(null);
    try {
      const res = await API.delete(`/events/${eventId}`);
      if (res.data.success) {
        addToast("Event deleted successfully!", "success");
        fetchEvents();
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to delete event.", "error");
    }
  };

  const getAudienceIcon = (audience) => {
    switch (audience) {
      case "students": return <FaUserGraduate />;
      case "alumni": return <FaUserTie />;
      default: return <FaGlobe />;
    }
  };

  const getAudienceLabel = (audience) => {
    switch (audience) {
      case "students": return "Students Only";
      case "alumni": return "Alumni Only";
      default: return "Open to All";
    }
  };

  const getStatusColor = (eventDate) => {
    const date = parseISO(eventDate);
    if (isPast(date)) return "status-past";
    if (isToday(date)) return "status-today";
    return "status-upcoming";
  };

  if (loading) {
    return (
      <div className="events">
        <div className="events-loading">
          <Loader className="loading-spinner" />
          <p>Loading events data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events">
        <div className="events-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="events">
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this event? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      <div className="events-hero">
        <div className="events-hero-content">
          <h1 className="events-title">University Events</h1>
          <p className="events-subtitle">
            Discover upcoming events, workshops, and networking opportunities
          </p>
          {userRole === "admin" && (
            <button
              className="create-event-btn-hero"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus /> Create New Event
            </button>
          )}
        </div>
      </div>

      <div className="events-container">
        <div className="events-search-filters-section">
          <div className="events-search-box">
            <FaSearch className="events-search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="events-search-input"
            />
          </div>

          <div className="events-filters">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="">All Status</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat === "All Types" ? "all" : cat.toLowerCase()}
                >
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Audiences</option>
              <option value="students">Students Only</option>
              <option value="alumni">Alumni Only</option>
            </select>
          </div>
        </div>

        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <div className="events-empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No Events Found</h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-image-container">
                  {event.image ? (
                    <img
                      src={
                        event.image.startsWith("http")
                          ? event.image
                          : `http://localhost:5000${event.image}`
                      }
                      alt={event.title}
                      className="event-image"
                    />
                  ) : (
                    <div className="event-image-placeholder">
                      <FaCalendarAlt size={48} />
                    </div>
                  )}
                  <div className="event-category-badge">{event.category}</div>

                  {userRole === "admin" && (
                    <button
                      className="event-delete-btn"
                      onClick={() => handleDeleteEvent(event._id)}
                      title="Delete Event"
                    >
                      <Trash2 />
                    </button>
                  )}

                  <div className={`event-status-badge ${getStatusColor(event.date)}`}>
                    {isPast(parseISO(event.date))
                      ? "Completed"
                      : isToday(parseISO(event.date))
                      ? "Today"
                      : "Upcoming"}
                  </div>
                </div>

                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-audience-badge">
                    {getAudienceIcon(event.targetAudience)}
                    <span>{getAudienceLabel(event.targetAudience)}</span>
                  </div>
                  <p className="event-description">
                    {event.description.length > 120
                      ? `${event.description.substring(0, 120)}...`
                      : event.description}
                  </p>

                  <div className="event-details">
                    <div className="event-detail-item">
                      <FaCalendarAlt className="event-icon" />
                      <span>{format(parseISO(event.date), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="event-detail-item">
                      <FaClock className="event-icon" />
                      <span>{event.time}</span>
                    </div>
                    <div className="event-detail-item">
                      <FaMapMarkerAlt className="event-icon" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="event-detail-item">
                      <FaUsers className="event-icon" />
                      <span>Capacity: {event.capacity || "Unlimited"}</span>
                    </div>
                  </div>

                  <div className="event-organizer">
                    <small>Organized by: {event.organizer}</small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="event-modal">
            <div className="modal-header">
              <h2>Create New Event</h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimesCircle />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="event-form-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Event Title</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  >
                    {categories
                      .filter((c) => c !== "All Types")
                      .map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    required
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Target Audience</label>
                  <select
                    value={newEvent.targetAudience}
                    onChange={(e) => setNewEvent({ ...newEvent, targetAudience: e.target.value })}
                  >
                    <option value="all">All Audiences</option>
                    <option value="students">Students Only</option>
                    <option value="alumni">Alumni Only</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    placeholder="Unlimited if empty"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Organizer</label>
                  <input
                    type="text"
                    required
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Contact Email</label>
                  <input
                    type="email"
                    required
                    value={newEvent.contactEmail}
                    onChange={(e) => setNewEvent({ ...newEvent, contactEmail: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Event Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Description</label>
                  <textarea
                    required
                    rows="4"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="event-btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="event-btn-submit">
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}