import { useState } from "react";
import {
  Search,
  Building2,
  Clock,
  MapPin,
  Info,
  Briefcase, 
} from "lucide-react";
import "./Jobs.css";

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all"); // all, jobs, internships

  const jobs = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "Innovatech Solutions",
      location: "Lahore, Pakistan",
      type: "Full-time",
      experience: "3-5 years",
      salary: "PKR 150,000 - 250,000",
      postedBy: "Alumni",
      postedDate: "2 days ago",
      description:
        "We're looking for an experienced Full Stack Developer to join our growing team. You'll work on cutting-edge web applications using React, Node.js, and cloud technologies.",
      requirements: ["React.js", "Node.js", "MongoDB", "AWS"],
      category: "job",
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "NextGen Solutions",
      location: "Remote",
      type: "Full-time",
      experience: "2-4 years",
      salary: "PKR 120,000 - 180,000",
      postedBy: "Admin",
      postedDate: "5 days ago",
      description:
        "Join our team to work on cloud-based applications and APIs. Great opportunity for growth and learning.",
      requirements: ["Python", "Django", "REST APIs", "Docker"],
      category: "job",
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Digital Innovations",
      location: "Karachi, Pakistan",
      type: "Full-time",
      experience: "1-3 years",
      salary: "PKR 80,000 - 130,000",
      postedBy: "Alumni",
      postedDate: "1 week ago",
      description:
        "Looking for a creative Frontend Developer to build beautiful and responsive user interfaces.",
      requirements: ["React.js", "CSS3", "JavaScript", "Responsive Design"],
      category: "job",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudTech Systems",
      location: "Islamabad, Pakistan",
      type: "Full-time",
      experience: "3+ years",
      salary: "PKR 180,000 - 280,000",
      postedBy: "Admin",
      postedDate: "3 days ago",
      description:
        "Seeking a skilled DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines.",
      requirements: ["Kubernetes", "Docker", "Jenkins", "AWS/Azure"],
      category: "job",
    },
    {
      id: 5,
      title: "Mobile App Developer",
      company: "AppVentures",
      location: "Remote",
      type: "Full-time",
      experience: "2+ years",
      salary: "PKR 100,000 - 160,000",
      postedBy: "Alumni",
      postedDate: "4 days ago",
      description:
        "Develop cross-platform mobile applications using React Native for our diverse client base.",
      requirements: ["React Native", "iOS/Android", "Firebase", "Redux"],
      category: "job",
    },
    {
      id: 6,
      title: "UI/UX Designer",
      company: "Creative Minds Studio",
      location: "Lahore, Pakistan",
      type: "Full-time",
      experience: "2-4 years",
      salary: "PKR 90,000 - 140,000",
      postedBy: "Alumni",
      postedDate: "1 week ago",
      description:
        "Create stunning user experiences and interfaces for web and mobile applications.",
      requirements: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      category: "job",
    },
  ];

  const internships = [
    {
      id: 7,
      title: "Frontend Development Intern",
      company: "Tech Solutions Ltd.",
      location: "Remote",
      type: "Internship",
      duration: "3 months",
      stipend: "PKR 20,000 - 30,000",
      postedBy: "Admin",
      postedDate: "2 days ago",
      description:
        "Work on React projects and assist in UI development. Perfect opportunity to learn modern web development.",
      requirements: ["HTML/CSS", "JavaScript", "React (Basic)", "Git"],
      category: "internship",
    },
    {
      id: 8,
      title: "Data Analyst Intern",
      company: "Analytics Corp.",
      location: "Karachi, Pakistan",
      type: "Internship",
      duration: "6 months",
      stipend: "PKR 25,000 - 35,000",
      postedBy: "Alumni",
      postedDate: "5 days ago",
      description:
        "Analyze datasets and create actionable reports. Gain hands-on experience with data visualization tools.",
      requirements: ["Excel", "Python", "SQL", "Power BI"],
      category: "internship",
    },
    {
      id: 9,
      title: "Backend Development Intern",
      company: "CodeCraft Solutions",
      location: "Lahore, Pakistan",
      type: "Internship",
      duration: "4 months",
      stipend: "PKR 22,000 - 32,000",
      postedBy: "Alumni",
      postedDate: "1 week ago",
      description:
        "Learn server-side development with Node.js and database management.",
      requirements: ["JavaScript", "Node.js", "MongoDB", "Express"],
      category: "internship",
    },
    {
      id: 10,
      title: "Mobile App Development Intern",
      company: "MobileFirst Inc.",
      location: "Remote",
      type: "Internship",
      duration: "3 months",
      stipend: "PKR 18,000 - 28,000",
      postedBy: "Admin",
      postedDate: "3 days ago",
      description:
        "Assist in developing mobile applications for Android and iOS platforms.",
      requirements: ["Java/Kotlin", "Flutter/React Native", "Git", "Mobile UI"],
      category: "internship",
    },
    {
      id: 11,
      title: "Digital Marketing Intern",
      company: "MarketGrow Agency",
      location: "Islamabad, Pakistan",
      type: "Internship",
      duration: "3 months",
      stipend: "PKR 15,000 - 25,000",
      postedBy: "Alumni",
      postedDate: "4 days ago",
      description:
        "Learn SEO, social media marketing, and content creation strategies.",
      requirements: [
        "Social Media",
        "Content Writing",
        "Basic SEO",
        "Analytics",
      ],
      category: "internship",
    },
    {
      id: 12,
      title: "Graphic Design Intern",
      company: "Creative Studios",
      location: "Karachi, Pakistan",
      type: "Internship",
      duration: "4 months",
      stipend: "PKR 20,000 - 30,000",
      postedBy: "Admin",
      postedDate: "6 days ago",
      description:
        "Create visual content for various digital platforms and marketing materials.",
      requirements: [
        "Adobe Photoshop",
        "Illustrator",
        "Creativity",
        "Portfolio",
      ],
      category: "internship",
    },
  ];

  // Combine jobs and internships for unified filtering
  const allOpportunities = [...jobs, ...internships];

  // Filter logic
  const filteredOpportunities = allOpportunities.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      filterLocation === "all" ||
      item.location.toLowerCase().includes(filterLocation.toLowerCase());

    const matchesType =
      filterType === "all" ||
      item.type.toLowerCase() === filterType.toLowerCase();

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "jobs" && item.category === "job") ||
      (activeTab === "internships" && item.category === "internship");

    return matchesSearch && matchesLocation && matchesType && matchesTab;
  });

  return (
    <div className="jobs-page">
      <div className="jobs-hero">
        <div className="jobs-hero-content">
          <h1 className="main-title">Career Opportunities</h1>
          <p className="subtitle">
            Explore jobs and internships posted by our alumni network and
            administrators
          </p>
        </div>
      </div>
      <div className="jobs-container">
        <div className="jobs-filters">
          {/* Tab Select */}
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-box">
              <Search size={22} className="search-icon" />
              <input
                type="text"
                placeholder="Search by title, company, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filters">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote</option>
                <option value="lahore">Lahore</option>
                <option value="karachi">Karachi</option>
                <option value="islamabad">Islamabad</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="internship">Internship</option>
              </select>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="tab-select"
              >
                <option value="all">
                  All Opportunities ({allOpportunities.length})
                </option>
                <option value="jobs">Jobs ({jobs.length})</option>
                <option value="internships">
                  Internships ({internships.length})
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>{filteredOpportunities.length} opportunities found</p>
        </div>

        {/* Opportunities Grid */}
        <div className="opportunities-grid">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((item) => (
              <div
                key={item.id}
                className={`opportunity-card ${item.category}`}
              >
<div className="card-header">
  <div className="card-meta">
    <span className={`badge ${item.category}`}>
      {item.category === "job" ? "Job" : "Internship"}
    </span>

    <span className="posted-date">
      {item.postedDate}
    </span>
  </div>

  <h2 className="job-title">{item.title}</h2>

  <p className="company-name">
    <Building2 size={18} />
    {item.company}
  </p>
</div>



                <div className="card-body">
                  <div className="info-row">
                    <span className="info-item">
                     <Clock size={20} />

                      {item.category === "job"
                        ? item.experience
                        : item.duration}
                    </span>
                    <span className="info-item">
                     <MapPin size={20} />

                      {item.location}
                    </span>
                    <span className="info-item">
                     <Briefcase size={20} />

                      {item.type}
                    </span>
                  </div>

                  <p className="description">{item.description}</p>

                  <div className="requirements">
                    <p className="requirements-label">Required Skills:</p>
                    <div className="skills-tags">
                      {item.requirements.map((req, idx) => (
                        <span key={idx} className="skill-tag">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="salary-info">
                     <Info size={20} />

                      <span>
                        {item.category === "job" ? item.salary : item.stipend}
                      </span>
                    </div>
                    <span className="posted-by">Posted by {item.postedBy}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn-primary">Apply Now</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="#E0E0E0"
                  strokeWidth="4"
                />
                <path
                  d="M32 20v16M32 44h.01"
                  stroke="#E0E0E0"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <h3>No opportunities found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
