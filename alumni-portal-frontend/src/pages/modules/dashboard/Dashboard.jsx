import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Briefcase,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  MapPin,
  Building,
  Bell,
  ChevronRight,
  Loader
} from "lucide-react";
import { getDashboardStats, getDashboardData } from "../../../api/dashboard";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = currentUser?.fullName || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // State management
  const [stats, setStats] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats and data in parallel
        const [statsRes, dataRes] = await Promise.all([
          getDashboardStats(),
          getDashboardData(),
        ]);

        setStats(statsRes.data.data);
        setDashboardData(dataRes.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format stats for display
  const formattedStats = stats
    ? [
      {
        label: "Upcoming Events",
        value: stats.upcomingEvents?.toString() || "0",
        icon: Calendar,
        trend: `+${stats.recentJobsCount || 0} this week`,
      },
      {
        label: "Job Openings",
        value: stats.jobOpenings?.toString() || "0",
        icon: Briefcase,
        trend: `+${stats.recentJobsCount || 0} new`,
      },
      {
        label: "Mentorship Requests",
        value: stats.mentorshipRequests?.toString() || "0",
        icon: Users,
        trend: currentUser.role === "alumni" ? "pending" : "active",
      },
      {
        label: "Unread Messages",
        value: stats.unreadMessages?.toString() || "0",
        icon: MessageSquare,
        trend: "conversations",
      },
    ]
    : [];
  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <Loader className="loading-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header Section */}
<header className="dashboard-header">
  {/* Background Image */}
  <img
    src="Cover-Alumni.jpg"
    alt="Header Background"
    className="header-bg"
  />

  {/* Dimming overlay */}
  <div className="header-dim-overlay"></div>

  {/* Left-side info panel */}
  <div className="header-left-panel">
    <h1 className="welcome-title">
      Welcome, <span>{userName}</span>
    </h1>
    <p className="welcome-subtitle">
      Stay connected with your alumni network. Explore connections, events, and mentorships at a glance.
    </p>
  </div>
</header>




      {/* Stats Grid */}
      <section className="stats-section">
        <div className="stats-grid">
          {formattedStats.map((stat, index) => (
            <div
              key={stat.label}
              className={"stat-card"}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-icon-wrapper">
                <stat.icon className="stat-icon" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                <span className="stat-trend">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* Upcoming Events */}
          <section className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <Calendar className="title-icon" />
                Upcoming Events
              </h2>
              <button
                className="view-all-btn"
                onClick={() => navigate("/modules/events")}
              >
                View All <ChevronRight className="btn-icon" />
              </button>
            </div>
            <div className="events-list">
              {dashboardData?.upcomingEvents?.length > 0 ? (
                dashboardData.upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  const day = eventDate.getDate();
                  const month = eventDate.toLocaleString("default", {
                    month: "short",
                  });

                  return (
                    <div key={event._id} className="event-item">
                      <div className="event-date-badge">
                        <span className="event-day">{day}</span>
                        <span className="event-month">{month}</span>
                      </div>
                      <div className="event-details">
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-meta">
                          <span className="event-meta-item">
                            <Clock className="meta-icon" /> {event.time || "TBA"}
                          </span>
                          <span className="event-meta-item">
                            <MapPin className="meta-icon" />{" "}
                            {event.location || "TBA"}
                          </span>
                        </div>
                        <div className="event-footer">
                          <span className="event-type-badge">
                            {event.type || "Event"}
                          </span>
                          <span className="event-attendees">
                            {event.attendees || 0} attending
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty-state">No upcoming events</p>
              )}
            </div>
          </section>

          {/* Recent Jobs */}
          <section className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <Briefcase className="title-icon" />
                Recent Job Postings
              </h2>
              <button
                className="view-all-btn"
                onClick={() => navigate("/modules/jobs")}
              >
                View All <ChevronRight className="btn-icon" />
              </button>
            </div>
            <div className="jobs-list">
              {dashboardData?.recentJobs?.length > 0 ? (
                dashboardData.recentJobs.map((job) => {
                  const postedDate = job.postedDate
                    ? new Date(job.postedDate)
                    : new Date(job.createdAt);
                  const daysAgo = Math.floor(
                    (Date.now() - postedDate) / (1000 * 60 * 60 * 24)
                  );
                  const postedText =
                    daysAgo === 0
                      ? "Today"
                      : daysAgo === 1
                        ? "Yesterday"
                        : `${daysAgo} days ago`;

                  return (
                    <div key={job._id} className="job-item">
                      <div className="job-company-logo">
                        <Building className="company-icon" />
                      </div>
                      <div className="job-details">
                        <h3 className="job-title">{job.title}</h3>
                        <p className="job-company">{job.company}</p>
                        <div className="job-meta">
                          <span className="job-location">
                            <MapPin className="meta-icon" /> {job.location}
                          </span>
                          <span className="job-type-badge">
                            {job.jobType || "Full-time"}
                          </span>
                        </div>
                      </div>
                      <div className="job-actions">
                        <span className="job-salary">{job.salary || "N/A"}</span>
                        <span className="job-posted">{postedText}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty-state">No job postings available</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Active Mentorships */}
          <section className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <Users className="title-icon" />
                Active Mentorships
              </h2>
              <button
                className="view-all-btn"
                onClick={() => navigate("/modules/mentorship")}
              >
                View All <ChevronRight className="btn-icon" />
              </button>
            </div>
            <div className="mentorship-list">
              {dashboardData?.activeMentorships?.length > 0 ? (
                dashboardData.activeMentorships.map((mentorship) => {
                  const otherUser =
                    currentUser.role === "student"
                      ? mentorship.mentor
                      : mentorship.student;
                  const initials = otherUser?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "??";

                  return (
                    <div key={mentorship._id} className="mentorship-item">
                      <div className="mentor-avatar">{initials}</div>
                      <div className="mentorship-details">
                        <h3 className="mentor-name">
                          {otherUser?.fullName || "Unknown"}
                        </h3>
                        <p className="mentor-role">{otherUser?.role || "User"}</p>
                        <p className="mentorship-topic">
                          {mentorship.topic || "General Mentorship"}
                        </p>
                        <div className="mentorship-progress">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${mentorship.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">
                            {mentorship.progress || 0}% complete
                          </span>
                        </div>
                        <p className="next-session">
                          <Clock className="meta-icon" /> Status: {mentorship.status}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty-state">No active mentorships</p>
              )}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="content-card quick-stats-card">
            <h2 className="card-title">
              <TrendingUp className="title-icon" />
              Network Growth
            </h2>
            <div className="quick-stats-grid">
              <div className="quick-stat">
                <span className="quick-stat-value">
                  {stats?.totalAlumni?.toLocaleString() || "0"}
                </span>
                <span className="quick-stat-label">Total Alumni</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">
                  {stats?.newThisMonth || "0"}
                </span>
                <span className="quick-stat-label">New This Month</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">
                  {stats?.engagementRate || "0"}%
                </span>
                <span className="quick-stat-label">Engagement Rate</span>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;