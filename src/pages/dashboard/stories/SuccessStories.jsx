import "./SuccessStories.css";

export default function SuccessStories() {
  const successStories = [
    {
      name: "Ayesha Khan",
      field: "Software Engineering",
      title: "From Intern to Full Stack Developer",
      story: "I started as an intern at Innovatech and, within 6 months, secured a full-time position. The mentorship and alumni network were invaluable.",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Bilal Ahmed",
      field: "Data Science",
      title: "Winning the National Hackathon",
      story: "Through the guidance of alumni mentors, I led my team to win a national hackathon. It boosted my confidence and career opportunities.",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Sara Malik",
      field: "Digital Marketing",
      title: "Launching My Own Startup",
      story: "Thanks to the alumni network, I got the support and funding to launch my digital marketing startup, which now serves clients worldwide.",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Usman Iqbal",
      field: "Cybersecurity",
      title: "Securing a Dream Job Abroad",
      story: "Mentorship sessions helped me prepare for international job interviews. I now work in a top cybersecurity firm in Germany.",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Hina Raza",
      field: "AI & Machine Learning",
      title: "Published My First Research Paper",
      story: "With guidance from experienced alumni in AI, I completed and published my first research paper in a reputed journal.",
      image: "https://via.placeholder.com/150",
    }
  ];

  return (
    <div className="success-container">
      <h1>Alumni Success Stories</h1>
      <div className="stories-list">
        {successStories.map((story, idx) => (
          <div key={idx} className="story-card">
            <img src={story.image} alt={story.name} />
            <h2>{story.title}</h2>
            <p className="name">{story.name}</p>
            <p className="field">{story.field}</p>
            <p className="story">{story.story}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
