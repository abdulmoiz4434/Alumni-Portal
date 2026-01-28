import Internships from "./Internships";
import "./Jobs.css";

export default function Jobs() {
  const jobs = [
    {
      title: "Full Stack Developer",
      company: "Innovatech",
      location: "Lahore, Pakistan",
      experience: "2+ years",
      description: "Develop web applications using React and Node.js.",
    },
    {
      title: "Software Engineer",
      company: "NextGen Solutions",
      location: "Remote",
      experience: "3+ years",
      description: "Work on cloud-based applications and APIs.",
    },
  ];

  return (
    <div className="jobs-container">
      {/* Render Internships component */}
      <Internships />

      {/* Jobs Section */}
      <section className="jobs-section">
        <h1>Jobs</h1>
        <div className="cards-list">
          {jobs.map((job, idx) => (
            <div key={idx} className="job-card">
              <h2>{job.title}</h2>
              <p className="company">{job.company}</p>
              <p className="location">{job.location}</p>
              <p className="duration">{job.experience}</p>
              <p className="description">{job.description}</p>
              <button className="apply-btn">Apply Now</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
