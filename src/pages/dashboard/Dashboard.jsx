import "./Dashboard.css";

export default function Dashboard() {
  const userName = "Ghulam Ahmad"; // Replace with dynamic user data
  const stats = [
    { title: "Unread Messages", count: 5 },
    { title: "Upcoming Events", count: 3 },
    { title: "Alumni Connected", count: 120 },
  ];

  const recentActivities = [
    "You applied for 'React Developer' job",
    "New event: 'Alumni Meetup 2026'",
    "Your profile was viewed by 3 people",
  ];

  const quickActions = ["Update Profile", "Post an Event", "Message Alumni"];

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h1>Welcome back, {userName}!</h1>
        <p>Here’s a quick overview of your activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <h2>{stat.count}</h2>
            <p>{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <ul>
          {recentActivities.map((activity, idx) => (
            <li key={idx}>{activity}</li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, idx) => (
          <button key={idx}>{action}</button>
        ))}
      </div>
    </div>
  );
}


