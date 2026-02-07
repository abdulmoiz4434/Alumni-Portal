import { useState, useEffect } from "react";
import { format, parseISO, isPast, isFuture, isToday } from "date-fns";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaFilter,
  FaSearch,
  FaUserGraduate,
  FaUserTie,
  FaGlobe,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import API from "../../../api/axios";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
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

  // Fetch events
  useEffect(() => {
    fetchEvents();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      const { user } = res.data.data;
      setUserRole(user.role);
      setUserId(user._id || user.id);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/events", {
        params: {
          status: selectedStatus,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery || undefined,
        },
      });

      setEvents(res.data.data);
      setFilteredEvents(res.data.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Filter events
  useEffect(() => {
    let filtered = [...events];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) =>
          event.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Audience filter
    if (selectedAudience !== "all") {
      filtered = filtered.filter(
        (event) =>
          event.targetAudience === selectedAudience ||
          event.targetAudience === "all",
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredEvents(filtered);
  }, [selectedCategory, selectedAudience, searchQuery, events]);

  // Handle event registration
  const handleRegister = async (eventId) => {
    try {
      const res = await API.post(`/events/${eventId}/register`);
      if (res.data.success) {
        alert("Successfully registered for the event!");
        fetchEvents(); // Refresh events
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      const res = await API.post(`/events/${eventId}/unregister`);
      if (res.data.success) {
        alert("Successfully unregistered from the event");
        fetchEvents();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unregistration failed");
    }
  };

  const isRegistered = (event) => {
    return event.registeredUsers?.some((user) => (user._id || user) === userId);
  };

  const getAudienceIcon = (audience) => {
    switch (audience) {
      case "students":
        return <FaUserGraduate />;
      case "alumni":
        return <FaUserTie />;
      default:
        return <FaGlobe />;
    }
  };

  const getAudienceLabel = (audience) => {
    switch (audience) {
      case "students":
        return "Students Only";
      case "alumni":
        return "Alumni Only";
      default:
        return "Open to All";
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
      <div className="events-loader-container">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events">
      {/* Header */}
      <div className="events-hero">
        <div className="events-hero-content">
          <h1 className="events-title">University Events</h1>
          <p className="events-subtitle">
            Discover and join upcoming events, workshops, and networking
            opportunities
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="events-container">
        <div className="events-filters-section">
          {/* Search Bar */}
          <div className="events-search-box">
            <FaSearch className="events-search-icon" />
            <input
              type="text"
              placeholder="Search events by title, description, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="events-search-input"
            />
          </div>

          {/* Filter Tabs */}
          <div className="events-filters">
            {/* Status Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <FaFilter /> Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  fetchEvents();
                }}
                className="filter-select"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="">All Status</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Audience Filter */}
            <div className="filter-group">
              <label className="filter-label">Audience</label>
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
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <div className="events-empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No Events Found</h3>
              <p>
                Try adjusting your filters or check back later for new events
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event._id} className="event-card">
                {/* Event Image */}
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

                  {/* Category Badge */}
                  <div className="event-category-badge">{event.category}</div>

                  {/* Status Badge */}
                  <div
                    className={`event-status-badge ${getStatusColor(event.date)}`}
                  >
                    {isPast(parseISO(event.date))
                      ? "Completed"
                      : isToday(parseISO(event.date))
                        ? "Today"
                        : "Upcoming"}
                  </div>
                </div>

                {/* Event Content */}
                <div className="event-content">
                  {/* Title */}
                  <h3 className="event-title">{event.title}</h3>

                  {/* Audience Badge */}
                  <div className="event-audience-badge">
                    {getAudienceIcon(event.targetAudience)}
                    <span>{getAudienceLabel(event.targetAudience)}</span>
                  </div>

                  {/* Description */}
                  <p className="event-description">
                    {event.description.length > 120
                      ? `${event.description.substring(0, 120)}...`
                      : event.description}
                  </p>

                  {/* Event Details */}
                  <div className="event-details">
                    <div className="event-detail-item">
                      <FaCalendarAlt className="event-icon" />
                      <span>
                        {format(parseISO(event.date), "MMM dd, yyyy")}
                      </span>
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
                      <span>
                        {event.registeredUsers?.length || 0}
                        {event.capacity ? `/${event.capacity}` : ""} registered
                      </span>
                    </div>
                  </div>

                  {/* Registration Button */}
                  <div className="event-actions">
                    {isFuture(parseISO(event.date)) ||
                    isToday(parseISO(event.date)) ? (
                      <>
                        {isRegistered(event) ? (
                          <button
                            onClick={() => handleUnregister(event._id)}
                            className="event-btn event-btn-unregister"
                          >
                            <FaTimesCircle /> Unregister
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegister(event._id)}
                            className="event-btn event-btn-register"
                            disabled={
                              !event.isRegistrationOpen ||
                              (event.capacity &&
                                event.registeredUsers?.length >= event.capacity)
                            }
                          >
                            <FaCheckCircle />
                            {event.capacity &&
                            event.registeredUsers?.length >= event.capacity
                              ? "Event Full"
                              : !event.isRegistrationOpen
                                ? "Registration Closed"
                                : "Register Now"}
                          </button>
                        )}
                      </>
                    ) : (
                      <button className="event-btn event-btn-disabled" disabled>
                        Event Ended
                      </button>
                    )}
                  </div>

                  {/* Organizer Info */}
                  <div className="event-organizer">
                    <small>Organized by: {event.organizer}</small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
