import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats] = useState({
    unreadMessages: 5,
    upcomingEvents: 3,
    alumniConnected: 120,
    jobPostings: 12,
    mentorshipRequests: 7,
    successStories: 25
  });

  const recentActivities = [
    { id: 1, text: "You applied for 'React Developer' job", time: "2 hours ago", type: "job" },
    { id: 2, text: "New event: 'Alumni Meetup 2026'", time: "5 hours ago", type: "event" },
    { id: 3, text: "Your profile was viewed by 3 people", time: "1 day ago", type: "profile" },
    { id: 4, text: "New message from Sarah Khan", time: "2 days ago", type: "message" },
    { id: 5, text: "Your mentorship request was accepted", time: "3 days ago", type: "mentorship" }
  ];

  const upcomingEvents = [
    { id: 1, title: "Alumni Meetup 2026", date: "Feb 15, 2026", location: "Multan Campus" },
    { id: 2, title: "Career Development Workshop", date: "Feb 20, 2026", location: "Online" },
    { id: 3, title: "Networking Night", date: "Mar 5, 2026", location: "Pearl Continental" }
  ];

  const featuredJobs = [
    { id: 1, title: "Senior React Developer", company: "TechCorp", location: "Remote", posted: "2 days ago" },
    { id: 2, title: "Product Manager", company: "StartupHub", location: "Lahore", posted: "4 days ago" },
    { id: 3, title: "UI/UX Designer", company: "DesignPro", location: "Karachi", posted: "1 week ago" }
  ];

  const mentorshipOpportunities = [
    { id: 1, name: "Dr. Ahmed Hassan", expertise: "Data Science", availability: "Available" },
    { id: 2, name: "Fatima Ali", expertise: "Software Engineering", availability: "Limited" },
    { id: 3, name: "Usman Malik", expertise: "Business Development", availability: "Available" }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-title">Welcome back, Ghulam Ahmad!</h1>
          <p className="welcome-subtitle">Here's a quick overview of your activities.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card messages">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>{stats.unreadMessages}</h3>
            <p>Unread Messages</p>
          </div>
        </div>

        <div className="stat-card events">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.upcomingEvents}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>

        <div className="stat-card alumni">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.alumniConnected}</h3>
            <p>Alumni Connected</p>
          </div>
        </div>

        <div className="stat-card jobs">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h3>{stats.jobPostings}</h3>
            <p>Active Job Postings</p>
          </div>
        </div>

        <div className="stat-card mentorship">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{stats.mentorshipRequests}</h3>
            <p>Mentorship Requests</p>
          </div>
        </div>

        <div className="stat-card stories">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.successStories}</h3>
            <p>Success Stories</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Activities */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Activities</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-dot ${activity.type}`}></div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card-actions">
            <button className="action-btn primary">Update Profile</button>
            <button className="action-btn secondary">Post an Event</button>
            <button className="action-btn secondary">Message Alumni</button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Upcoming Events</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="events-list">
            {upcomingEvents.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-date">
                  <span className="event-day">{event.date.split(' ')[1].replace(',', '')}</span>
                  <span className="event-month">{event.date.split(' ')[0]}</span>
                </div>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <p className="event-location">📍 {event.location}</p>
                </div>
                <button className="event-register-btn">Register</button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Jobs */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Featured Job Opportunities</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="jobs-list">
            {featuredJobs.map(job => (
              <div key={job.id} className="job-item">
                <div className="job-icon">💼</div>
                <div className="job-details">
                  <h4>{job.title}</h4>
                  <p className="job-company">{job.company}</p>
                  <div className="job-meta">
                    <span>📍 {job.location}</span>
                    <span className="job-posted">Posted {job.posted}</span>
                  </div>
                </div>
                <button className="job-apply-btn">Apply</button>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship Opportunities */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Available Mentors</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="mentors-list">
            {mentorshipOpportunities.map(mentor => (
              <div key={mentor.id} className="mentor-item">
                <div className="mentor-avatar">
                  {mentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="mentor-details">
                  <h4>{mentor.name}</h4>
                  <p className="mentor-expertise">{mentor.expertise}</p>
                  <span className={`mentor-status ${mentor.availability.toLowerCase()}`}>
                    {mentor.availability}
                  </span>
                </div>
                <button className="mentor-connect-btn">Connect</button>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="dashboard-card profile-completion">
          <div className="card-header">
            <h2>Profile Completion</h2>
          </div>
          <div className="progress-section">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: '75%' }}></div>
            </div>
            <span className="progress-text">75% Complete</span>
          </div>
          <div className="completion-items">
            <div className="completion-item completed">
              <span className="check-icon">✓</span>
              <span>Basic Information</span>
            </div>
            <div className="completion-item completed">
              <span className="check-icon">✓</span>
              <span>Educational Background</span>
            </div>
            <div className="completion-item completed">
              <span className="check-icon">✓</span>
              <span>Profile Picture</span>
            </div>
            <div className="completion-item incomplete">
              <span className="check-icon">○</span>
              <span>Work Experience</span>
            </div>
            <div className="completion-item incomplete">
              <span className="check-icon">○</span>
              <span>Skills & Certifications</span>
            </div>
          </div>
          <button className="action-btn primary full-width">Complete Profile</button>
        </div>

        {/* Quick Links */}
        <div className="dashboard-card quick-links">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-links-grid">
            <button className="quick-link-btn">
              <span className="quick-link-icon">👤</span>
              <span>Edit Profile</span>
            </button>
            <button className="quick-link-btn">
              <span className="quick-link-icon">🔍</span>
              <span>Find Alumni</span>
            </button>
            <button className="quick-link-btn">
              <span className="quick-link-icon">💼</span>
              <span>Browse Jobs</span>
            </button>
            <button className="quick-link-btn">
              <span className="quick-link-icon">📅</span>
              <span>Create Event</span>
            </button>
            <button className="quick-link-btn">
              <span className="quick-link-icon">🎓</span>
              <span>Find Mentor</span>
            </button>
            <button className="quick-link-btn">
              <span className="quick-link-icon">📝</span>
              <span>Share Story</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;