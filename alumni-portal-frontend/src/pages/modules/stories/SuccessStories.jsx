import { useState, useEffect } from "react";
import { 
  FiPlus, 
  FiTrash2, 
  FiUser, 
  FiCalendar, 
  FiBookOpen, 
  FiX 
} from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import API from "../../../api/axios";
import { Toast, useToast } from "../Profile/Toast";
import "./SuccessStories.css";

// Confirm Dialog Component
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn confirm-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Story Card Component
function StoryCard({ story, user, onDelete, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;

  const shouldShowReadMore = story.content.length > maxLength;
  const contentToShow = isExpanded
    ? story.content
    : `${story.content.substring(0, maxLength)}...`;

  const currentUserId = user?._id || user?.id;
  const storyAlumnusId = story.alumnus?._id || story.alumnus?.id || story.alumnus;
  const isOwner =
    currentUserId &&
    storyAlumnusId &&
    String(currentUserId) === String(storyAlumnusId);
  const isAdmin = user?.role === "admin";
  const canDelete = isOwner || isAdmin;

  return (
    <article
      className="story-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="story-accent-bar" />

      {canDelete && (
        <button
          className="story-delete-btn"
          onClick={() => onDelete(story._id)}
          title="Delete Story"
        >
          <FiTrash2 size={16} />
        </button>
      )}

      <FaQuoteLeft className="story-quote-icon" size={20} />

      <div className="story-card-body">
        <p className="story-text">
          {shouldShowReadMore ? contentToShow : story.content}
        </p>
        {shouldShowReadMore && (
          <button
            className="read-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

      <div className="story-card-footer">
        <div className="story-footer-info">
          <div className="story-avatar-wrapper">
            {story.alumnus?.profilePicture ? (
              <img src={story.alumnus.profilePicture} alt="" className="story-avatar" />
            ) : (
              <div className="story-avatar-placeholder">
                <FiUser size={18} />
              </div>
            )}
          </div>
          <div className="story-card-info">
            <h3 className="story-name">
              {story.alumnus?.fullName || "Anonymous Alumni"}
            </h3>
            <p className="story-meta">
              {story.title}
              {story.alumnus?.batch && ` · Class of ${story.alumnus.batch}`}
            </p>
          </div>
        </div>
        <div className="story-date">
          <FiCalendar size={12} />
          {new Date(story.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </article>
  );
}

// Add Story Modal Component
function AddStoryModal({ onClose, newStory, onChange, onSubmit }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Share Your Success Story</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Headline / Current Role</label>
            <input
              type="text"
              name="title"
              value={newStory.title}
              onChange={onChange}
              className="form-input"
              placeholder="e.g. Senior Dev at Google"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Journey</label>
            <textarea
              name="story"
              value={newStory.story}
              onChange={onChange}
              className="form-textarea"
              rows="6"
              placeholder="Tell students how you got where you are today..."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-button modal-button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-button modal-button-submit"
            onClick={onSubmit}
            disabled={!newStory.title.trim() || !newStory.story.trim()}
          >
            Submit Story
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const user = JSON.parse(localStorage.getItem("user"));
  const [newStory, setNewStory] = useState({ title: "", story: "" });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await API.get("/stories");
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
      const response = await API.post("/stories", {
        title: newStory.title,
        content: newStory.story,
      });

      if (response.data.success) {
        setStories((prev) => [response.data.data, ...prev]);
        setNewStory({ title: "", story: "" });
        setShowAddStoryModal(false);
        addToast("Your story has been shared successfully!", "success");
      }
    } catch (error) {
      console.error("Error adding story:", error);
      addToast(error.response?.data?.message || "Failed to submit story.", "error");
    }
  };

  const handleDeleteStory = (storyId) => {
    setConfirmDialog({ storyId });
  };

  const confirmDelete = async () => {
    const { storyId } = confirmDialog;
    setConfirmDialog(null);
    try {
      const response = await API.delete(`/stories/${storyId}`);
      if (response.data.success) {
        setStories((prev) => prev.filter((s) => s._id !== storyId));
        addToast("Story deleted successfully.", "success");
      }
    } catch (error) {
      console.error("Full Error Object:", error);
      addToast(error.response?.data?.message || "Could not delete the story.", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStory((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="success-stories">
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this story? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      <div className="success-stories-hero">
        <div className="success-stories-hero-content">
          <h1 className="success-stories-title">Alumni Success Stories</h1>
          <p className="success-stories-subtitle">
            Inspiring journeys of our graduates making an impact around the world
          </p>

          {user?.role === "alumni" && (
            <div className="hero-add-button-wrapper">
              <button
                className="add-story-button"
                onClick={() => setShowAddStoryModal(true)}
              >
                <FiPlus size={20} />
                Share Your Journey
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="success-stories-container">
        {loading ? (
          <div className="loader">
            <div className="loader-spinner" />
            <p>Loading inspiring stories...</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="success-stories-grid">
            {stories.map((story, i) => (
              <StoryCard
                key={story._id}
                story={story}
                user={user}
                onDelete={handleDeleteStory}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <FiBookOpen size={48} className="no-results-icon" />
            <h3>No stories yet</h3>
            <p>Be the first to share your journey with the community!</p>
          </div>
        )}
      </div>

      {showAddStoryModal && (
        <AddStoryModal
          onClose={() => setShowAddStoryModal(false)}
          newStory={newStory}
          onChange={handleInputChange}
          onSubmit={handleAddStory}
        />
      )}
    </div>
  );
}