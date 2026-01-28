import "./Internships.css";

export default function Internships() {
  const internships = [
    {
      title: "Frontend Intern",
      company: "Tech Solutions Ltd.",
      location: "Remote",
      duration: "3 months",
      description: "Work on React projects and assist in UI development.",
    },
    {
      title: "Data Analyst Intern",
      company: "Analytics Corp.",
      location: "Karachi, Pakistan",
      duration: "6 months",
      description: "Analyze datasets and create actionable reports.",
    },
  ];

  return (
    <section className="internships-section">
      <h1>Internships</h1>
      <div className="cards-list">
        {internships.map((intern, idx) => (
          <div key={idx} className="job-card">
            <h2>{intern.title}</h2>
            <p className="company">{intern.company}</p>
            <p className="location">{intern.location}</p>
            <p className="duration">{intern.duration}</p>
            <p className="description">{intern.description}</p>
            <button className="apply-btn">Apply Now</button>
          </div>
        ))}
      </div>
    </section>
  );
}
