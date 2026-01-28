import "./Events.css";

export default function Events() {
  const events = [
    {
      title: "Alumni Meetup 2026",
      date: "2026-02-15",
      location: "University Campus Hall",
      description: "Connect with fellow alumni and network for opportunities.",
    },
    {
      title: "Web Development Workshop",
      date: "2026-03-01",
      location: "Online (Zoom)",
      description: "Learn latest trends in React and JavaScript development.",
    },
    {
      title: "Charity Fundraiser",
      date: "2026-04-10",
      location: "City Convention Center",
      description: "Support our community projects and fundraising campaigns.",
    },
  ];

  return (
    <div className="events-container">
      <h1>Upcoming Events</h1>
      <div className="events-list">
        {events.map((event, idx) => (
          <div key={idx} className="event-card">
            <h2>{event.title}</h2>
            <p className="event-date">{new Date(event.date).toDateString()}</p>
            <p className="event-location">{event.location}</p>
            <p className="event-description">{event.description}</p>
            <button className="register-btn">Register</button>
          </div>
        ))}
      </div>
    </div>
  );
}
