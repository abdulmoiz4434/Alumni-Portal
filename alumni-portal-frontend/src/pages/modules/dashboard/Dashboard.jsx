import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Briefcase,
  TrendingUp,
  Clock,
  MapPin,
  Building,
  ChevronRight,
  Loader
} from "lucide-react";
import { getDashboardStats, getDashboardData } from "../../../api/dashboard";
import "./Dashboard.css";

const getRoleSubtitle = (role) => {
  switch (role) {
    case "alumni":
      return "Give back and grow your network. Connect with students, mentor emerging talent, and explore alumni events.";
    case "admin":
      return "Manage your alumni network efficiently. Oversee users, events, and mentorship programs in one place.";
    default:
      return "Stay connected with your alumni network. Explore connections, events, and mentorships at a glance.";
  }
};

const Dashboard = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = currentUser?.fullName || "User";
  const userRole = currentUser?.role || "student";

  const [stats, setStats] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

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

  const formattedStats = stats
    ? [
      {
        label: "Upcoming Events",
        value: stats.upcomingEvents?.toString() || "0",
        icon: Calendar,
        trend: stats.upcomingEventsThisWeek
          ? `+${stats.upcomingEventsThisWeek} this week`
          : "0 this week",
      },
      {
        label: "Job Openings",
        value: stats.jobOpenings?.toString() || "0",
        icon: Briefcase,
        trend: stats.recentJobsCount
          ? `+${stats.recentJobsCount} new`
          : "0 new",
      },
    ]
    : [];

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
      <header className="dashboard-header">
        <img
          src="Cover-Alumni.jpg"
          alt="Header Background"
          className="header-bg"
        />
        <div className="header-dim-overlay"></div>
        <div className="header-left-panel">
          <h1 className="welcome-title">
            Welcome, <span>{userName}</span>
          </h1>
          <p className="welcome-subtitle">
            {getRoleSubtitle(userRole)}
          </p>
        </div>
      </header>

      <section className="stats-section">
        <div className="stats-grid">
          {formattedStats.map((stat) => (
            <div key={stat.label} className="stat-card">
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

      <div className="main-grid">
        <div className="left-column">
          <section className="content-card">
            <div className="dashboard-card-header">
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
                            {event.venue || "TBA"}
                          </span>
                        </div>
                        <div className="event-footer">
                          <span className="event-type-badge">
                            {event.category || "Event"}
                          </span>
                          <span className="event-attendees">
                            Capacity: {event.capacity || 0}
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
          <section className="content-card">
            <div className="dashboard-card-header">
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
                  const postedDate = new Date(job.createdAt);
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
                            {job.category
                              ? job.category.charAt(0).toUpperCase() + job.category.slice(1)
                              : "Full-time"}
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

        <div className="right-column">
          <section className="content-card quick-stats-card">
            <h2 className="card-title">
              <TrendingUp className="title-icon" />
              Network Growth
            </h2>
            <div className="quick-stats-grid">
              <div className="quick-stat">
                <span className="quick-stat-value">
                  {((stats?.totalAlumni ?? 1) - 1).toLocaleString()}
                </span>
                <span className="quick-stat-label">Total Users</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">
                  {stats?.newThisMonth || "0"}
                </span>
                <span className="quick-stat-label">New Users This Month</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">
                  {stats?.engagementRate || "0"}%
                </span>
                <span className="quick-stat-label">User Engagement Rate</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;