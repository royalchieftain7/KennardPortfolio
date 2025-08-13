import React, { useState, useEffect } from "react";

const PortfolioModal = ({ isOpen, onClose, project, onSave }) => {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (project && project.description) {
      setDescription(project.description);
    } else {
      setDescription("");
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(description);
    }
    onClose();
  };

  return (
    <div className="portfolio-modal-overlay" style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div className="portfolio-modal-content" style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        maxWidth: "600px",
        width: "100%",
        position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer"
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <img
          src={project.src}
          alt={project.title || "Project"}
          style={{ width: "100%", borderRadius: "4px", marginBottom: "1rem" }}
        />
        <h2>{project.title}</h2>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter project description..."
          style={{
            width: "100%",
            minHeight: "100px",
            marginTop: "1rem",
            marginBottom: "1rem",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        <div style={{ textAlign: "right" }}>
          <button
            onClick={handleSave}
            style={{
              background: "#0057ff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem 1.5rem",
              cursor: "pointer"
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;