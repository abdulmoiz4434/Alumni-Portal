import { useState, useEffect } from "react";
import axios from "axios";
import "./SuccessStories.css";

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  
  // Get current user to check role
  const user = JSON.parse(localStorage.getItem("user")); 

  const [newStory, setNewStory] = useState({
    title: "",
    story: "",
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stories"); 
      if (response.data.success) {
        setStories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStory = async () => {
    try {
      const response = await axios.post("/api/stories", {
        title: newStory.title,
        content: newStory.story,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.data.success) {
        fetchStories(); 
        setNewStory({ title: "", story: "" });
        setShowAddStoryModal(false);
        alert("Story submitted! It will appear once approved by admin.");
      }
    } catch (error) {
      console.error("Error adding story:", error);
      alert(error.response?.data?.message || "Failed to submit story");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStory((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loader">Loading inspiring stories...</div>;

  return (
    <div className="success-stories">
      {/* Hero Section */}
      <div className="success-stories-hero">
        <div className="success-stories-hero-content">
          <h1 className="success-stories-title">Alumni Success Stories</h1>
          <p className="success-stories-subtitle">
            Inspiring journeys of our graduates making an impact around the world
          </p>
          
          {/* MOVED BUTTON: Now right under the subtitle */}
          {user?.role === "alumni" && (
            <div className="hero-add-button-wrapper">
              <button className="add-story-button" onClick={() => setShowAddStoryModal(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Share Your Journey
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="success-stories-container">
        <div className="success-stories-grid">
          {stories.length > 0 ? (
            stories.map((story) => (
              <article key={story._id} className="story-card">
                <div className="story-card-header">
                  <div className="story-avatar-wrapper">
                    {story.alumnus?.profilePicture ? (
                      <img
                        src={story.alumnus.profilePicture}
                        alt={story.alumnus.fullName}
                        className="story-avatar"
                      />
                    ) : (
                      <div className="story-avatar-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="8" r="4" /><path d="M16 20c0-4-8-4-8 0" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="story-card-info">
                    <h3 className="story-name">{story.alumnus?.fullName || "Anonymous Alumni"}</h3>
                    <p className="story-meta">{story.title}</p>
                  </div>
                </div>

                <div className="story-card-body">
                  <p className="story-text">{story.content}</p>
                </div>

                <div className="story-card-footer">
                  <span className="story-date">
                    {new Date(story.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="no-stories-container">
               <p className="no-stories">No success stories found yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal remains the same */}
      {showAddStoryModal && (
        <div className="modal-overlay" onClick={() => setShowAddStoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Share Your Success Story</h2>
              <button className="modal-close" onClick={() => setShowAddStoryModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Headline / Current Role</label>
                <input
                  type="text"
                  name="title"
                  value={newStory.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Senior Dev at Google"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Journey</label>
                <textarea
                  name="story"
                  value={newStory.story}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="6"
                  placeholder="Tell students how you got where you are today..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-button modal-button-cancel" onClick={() => setShowAddStoryModal(false)}>
                Cancel
              </button>
              <button className="modal-button modal-button-submit" onClick={handleAddStory}>
                Submit Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}