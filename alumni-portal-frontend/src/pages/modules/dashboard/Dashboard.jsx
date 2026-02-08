import { 
  Calendar, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Clock,
  MapPin,
  Building,
  ArrowRight,
  Bell,
  ChevronRight
} from "lucide-react";
import "./Dashboard.css";

// Mock Data
const stats = [
  { label: "Upcoming Events", value: "12", icon: Calendar, trend: "+3 this week" },
  { label: "Job Openings", value: "48", icon: Briefcase, trend: "+8 new" },
  { label: "Mentorship Requests", value: "6", icon: Users, trend: "2 pending" },
  { label: "Unread Messages", value: "9", icon: MessageSquare, trend: "3 urgent" },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Annual Alumni Meetup 2025",
    date: "Feb 15, 2025",
    time: "6:00 PM",
    location: "University Main Hall",
    attendees: 245,
    type: "Networking",
  },
  {
    id: 2,
    title: "Tech Talk: AI in Industry",
    date: "Feb 20, 2025",
    time: "3:00 PM",
    location: "Virtual Event",
    attendees: 128,
    type: "Webinar",
  },
  {
    id: 3,
    title: "Career Fair Spring 2025",
    date: "Mar 5, 2025",
    time: "10:00 AM",
    location: "Campus Convention Center",
    attendees: 500,
    type: "Career",
  },
];

const recentJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "2 days ago",
    salary: "$150k - $180k",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateTech",
    location: "New York, NY",
    type: "Full-time",
    posted: "3 days ago",
    salary: "$130k - $160k",
  },
  {
    id: 3,
    title: "Data Analyst Intern",
    company: "DataDriven Co.",
    location: "Remote",
    type: "Internship",
    posted: "1 day ago",
    salary: "$35/hour",
  },
];

const activeMentorships = [
  {
    id: 1,
    mentorName: "Dr. Sarah Johnson",
    mentorRole: "CTO at CloudTech",
    mentorAvatar: "SJ",
    topic: "Career Transition to Tech Leadership",
    nextSession: "Feb 12, 2025",
    progress: 60,
  },
  {
    id: 2,
    mentorName: "Michael Chen",
    mentorRole: "Senior PM at Google",
    mentorAvatar: "MC",
    topic: "Product Management Fundamentals",
    nextSession: "Feb 14, 2025",
    progress: 35,
  },
];

const successStories = [
  {
    id: 1,
    name: "Emily Rodriguez",
    batch: "Class of 2020",
    avatar: "ER",
    achievement: "Founded AI startup valued at $50M",
    story: "From campus hackathon winner to leading a team of 40 engineers...",
  },
  {
    id: 2,
    name: "James Park",
    batch: "Class of 2018",
    avatar: "JP",
    achievement: "Youngest VP at Fortune 500 Company",
    story: "Leveraged mentorship connections to accelerate career growth...",
  },
];

const notifications = [
  { id: 1, message: "New mentorship request from Alex Turner", time: "10 min ago", unread: true },
  { id: 2, message: "Event reminder: Tech Talk tomorrow at 3 PM", time: "1 hour ago", unread: true },
  { id: 3, message: "Your job application was viewed by TechCorp", time: "2 hours ago", unread: false },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, <span className="highlight">Ahmed</span></h1>
            <p className="welcome-subtitle">Here's what's happening in your alumni network</p>
          </div>
          <div className="header-actions">
            <div className="notification-bell">
              <Bell className="bell-icon" />
              <span className="notification-badge">3</span>
            </div>
            <div className="user-avatar">AK</div>
          </div>
        </div>
      </header>

      {/* Quick Notifications */}
      <section className="notifications-strip">
        <div className="notifications-scroll">
          {notifications.filter(n => n.unread).map((notification) => (
            <div key={notification.id} className="notification-item">
              <span className="notification-dot"></span>
              <span className="notification-text">{notification.message}</span>
              <span className="notification-time">{notification.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Grid */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className={`stat-card ${index === 0 ? 'stat-card-primary' : ''}`}
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
              <button className="view-all-btn">
                View All <ChevronRight className="btn-icon" />
              </button>
            </div>
            <div className="events-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-date-badge">
                    <span className="event-day">{event.date.split(' ')[1].replace(',', '')}</span>
                    <span className="event-month">{event.date.split(' ')[0]}</span>
                  </div>
                  <div className="event-details">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-meta">
                      <span className="event-meta-item">
                        <Clock className="meta-icon" /> {event.time}
                      </span>
                      <span className="event-meta-item">
                        <MapPin className="meta-icon" /> {event.location}
                      </span>
                    </div>
                    <div className="event-footer">
                      <span className="event-type-badge">{event.type}</span>
                      <span className="event-attendees">{event.attendees} attending</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Jobs */}
          <section className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <Briefcase className="title-icon" />
                Recent Job Postings
              </h2>
              <button className="view-all-btn">
                View All <ChevronRight className="btn-icon" />
              </button>
            </div>
            <div className="jobs-list">
              {recentJobs.map((job) => (
                <div key={job.id} className="job-item">
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
                      <span className="job-type-badge">{job.type}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    <span className="job-salary">{job.salary}</span>
                    <span className="job-posted">{job.posted}</span>
                  </div>
                </div>
              ))}
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
              <button className="view-all-btn">
                View All <ChevronRight className="btn-icon" />
              </button>
            </div>
            <div className="mentorship-list">
              {activeMentorships.map((mentorship) => (
                <div key={mentorship.id} className="mentorship-item">
                  <div className="mentor-avatar">{mentorship.mentorAvatar}</div>
                  <div className="mentorship-details">
                    <h3 className="mentor-name">{mentorship.mentorName}</h3>
                    <p className="mentor-role">{mentorship.mentorRole}</p>
                    <p className="mentorship-topic">{mentorship.topic}</p>
                    <div className="mentorship-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${mentorship.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{mentorship.progress}% complete</span>
                    </div>
                    <p className="next-session">
                      <Clock className="meta-icon" /> Next: {mentorship.nextSession}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Success Stories */}
          <section className="content-card">
            <div className="card-header">
              <h2 className="card-title">
                <Award className="title-icon" />
                Success Stories
              </h2>
              <button className="view-all-btn">
                View All <ChevronRight className="btn-icon" />
              </button>
            </div>
            <div className="stories-list">
              {successStories.map((story) => (
                <div key={story.id} className="story-item">
                  <div className="story-avatar">{story.avatar}</div>
                  <div className="story-content">
                    <h3 className="story-name">{story.name}</h3>
                    <span className="story-batch">{story.batch}</span>
                    <p className="story-achievement">{story.achievement}</p>
                    <p className="story-excerpt">{story.story}</p>
                    <button className="read-more-btn">
                      Read Full Story <ArrowRight className="btn-icon" />
                    </button>
                  </div>
                </div>
              ))}
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
                <span className="quick-stat-value">2,450</span>
                <span className="quick-stat-label">Total Alumni</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">156</span>
                <span className="quick-stat-label">New This Month</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">89%</span>
                <span className="quick-stat-label">Engagement Rate</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">42</span>
                <span className="quick-stat-label">Countries</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;