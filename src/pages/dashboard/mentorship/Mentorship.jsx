import React from "react";
import "./Mentorship.css";

export default function Mentorship() {
  const mentorships = [
    {
      title: "React Mentorship Program",
      mentor: "Ali Khan",
      field: "Frontend Development",
      duration: "3 months",
      description: "Get hands-on guidance on building React projects with a senior developer.",
    },
    {
      title: "Data Science Mentorship",
      mentor: "Sara Ahmed",
      field: "Data Science & AI",
      duration: "6 months",
      description: "Learn data analysis, machine learning, and real-world applications from an expert.",
    },
    {
      title: "Career Guidance Program",
      mentor: "Usman Iqbal",
      field: "Career & Networking",
      duration: "2 months",
      description: "One-on-one mentorship to help you plan your career path and improve networking skills.",
    },
  ];

  return (
    <div className="mentorship-container">
      <h1>Mentorship Opportunities</h1>
      <div className="mentorship-list">
        {mentorships.map((m, idx) => (
          <div key={idx} className="mentorship-card">
            <h2>{m.title}</h2>
            <p className="mentor">Mentor: {m.mentor}</p>
            <p className="field">Field: {m.field}</p>
            <p className="duration">Duration: {m.duration}</p>
            <p className="description">{m.description}</p>
            <button className="connect-btn">Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
}
