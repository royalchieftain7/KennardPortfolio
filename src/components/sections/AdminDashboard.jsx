import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { supabase } from "../../supabaseClient";

const ADMIN_CACHE_KEY = "admin_logged_in";

const AdminDashboard = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [size, setSize] = useState("normal");
  const [website, setWebsite] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order", { ascending: true });
      if (!error) setProjects(data);
      setFetching(false);
    };
    fetchProjects();
  }, [success, modalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    // REMOVE: Check Supabase auth session (allow all uploads)
    // const { data: sessionData } = await supabase.auth.getSession();
    // if (!sessionData || !sessionData.session) {
    //   setError("You must be logged in to upload files.");
    //   setLoading(false);
    //   return;
    // }

    if (!title || !category || !size || files.length === 0) {
      setError("All fields are required, including at least one image.");
      setLoading(false);
      return;
    }
    if (website && (!websiteUrl || !websiteUrl.trim())) {
      setError("Please enter a valid website URL.");
      setLoading(false);
      return;
    }
    if (files.length > 4) {
      setError("You can upload a maximum of 4 images.");
      setLoading(false);
      return;
    }

    // Validate file types and sizes
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4"
    ];
    const maxImageSize = 25 * 1024 * 1024; // 25MB for images
    const maxVideoSize = 50 * 1024 * 1024; // 50MB for mp4

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG, PNG, WEBP images and MP4 videos are allowed.");
        setLoading(false);
        return;
      }
      if (
        (file.type === "video/mp4" && file.size > maxVideoSize) ||
        (file.type !== "video/mp4" && file.size > maxImageSize)
      ) {
        setError(
          file.type === "video/mp4"
            ? "MP4 videos must be 50MB or less."
            : "Each image must be 25MB or less."
        );
        setLoading(false);
        return;
      }
    }

    // Upload all files to Supabase Storage
    const bucket = "portfolio-media";
    const uploadPromises = files.map(file => {
      const filePath = `${Date.now()}_${file.name}`;
      return supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: "3600", upsert: false })
        .then(({ error }) => {
          if (error) throw error;
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
          return urlData?.publicUrl || null;
        });
    });

    let imageUrls = [];
    try {
      imageUrls = await Promise.all(uploadPromises);
    } catch (uploadError) {
      setError("Upload failed: " + uploadError.message);
      setLoading(false);
      return;
    }

    if (imageUrls.some(url => !url)) {
      setError("Failed to get public URL for one or more uploaded files.");
      setLoading(false);
      return;
    }

    // Insert into projects table with image_urls array
    const { error: dbError } = await supabase.from("projects").insert([
      {
        title,
        category,
        image_url: imageUrls, // store array in image_url
        size,
        website: website && typeof website === "string" && website.trim() ? website : websiteUrl && websiteUrl.trim() ? websiteUrl : null,
      },
    ]);
    if (dbError) {
      setError(dbError.message);
    } else {
      setSuccess("Portfolio item added successfully!");
      setTitle("");
      setCategory("");
      setFiles([]);
      setSize("normal");
      setModalOpen(false);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_CACHE_KEY);
    window.location.href = "/admin/login";
  };

  // Card rendering
  const [editItem, setEditItem] = useState(null);

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("projects").delete().eq("id", deleteId);
    if (error) {
      alert("Failed to delete item: " + error.message);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
    }
    setDeleteId(null);
  };

  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleEditSave = async (updated) => {
    const { error } = await supabase
      .from("projects")
      .update({
        title: updated.title,
        category: updated.category,
        size: updated.size,
        image_url: updated.image_url,
        website: updated.website && typeof updated.websiteUrl === "string" && updated.websiteUrl.trim() ? updated.websiteUrl : null,
      })
      .eq("id", updated.id);
    if (error) {
      alert("Failed to update item: " + error.message);
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated, website: updated.website && typeof updated.websiteUrl === "string" && updated.websiteUrl.trim() ? updated.websiteUrl : null } : p))
      );
      setEditItem(null);
    }
  };

  const renderCard = (item, idx) => (
    <div
      key={item.id}
      style={{
        background: "#232323",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        padding: "1rem",
        minWidth: 260,
        maxWidth: 320,
        width: "100%",
        margin: "0.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        height: 420, // fixed height for all cards
        justifyContent: "flex-start"
      }}
      tabIndex={0}
      data-drag-index={idx}
    >
      <button
        onClick={() => handleDelete(item.id)}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "none",
          border: "none",
          color: "#ff4d4f",
          fontSize: 20,
          cursor: "pointer"
        }}
        title="Delete"
        aria-label="Delete"
      >
        🗑️
      </button>
      <button
        onClick={() => handleEdit(item)}
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "none",
          border: "none",
          color: "#00bfff",
          fontSize: 20,
          cursor: "pointer"
        }}
        title="Edit"
        aria-label="Edit"
      >
        ✏️
      </button>
      {(() => {
        // Handle both array and string for image_url, and fix stringified array edge cases
        let firstMedia = "";
        if (Array.isArray(item.image_url)) {
          firstMedia = item.image_url.find(
            url => typeof url === "string" && url.trim() && url !== "[]" && url !== '""'
          );
        } else if (typeof item.image_url === "string" && item.image_url.trim() && item.image_url !== "[]" && item.image_url !== '""') {
          try {
            const parsed = JSON.parse(item.image_url);
            if (Array.isArray(parsed)) {
              firstMedia = parsed.find(
                url => typeof url === "string" && url.trim() && url !== "[]" && url !== '""'
              );
            } else {
              firstMedia = item.image_url.replace(/^\[|\]$/g, "").replace(/^"(.*)"$/, "$1");
            }
          } catch {
            firstMedia = item.image_url.replace(/^\[|\]$/g, "").replace(/^"(.*)"$/, "$1");
          }
        }
        if (!firstMedia) return null;
        const src = firstMedia.replace(/^\[|\]$/g, "").replace(/^"(.*)"$/, "$1");
        if (src.toLowerCase().endsWith(".mp4")) {
          return (
            <video
              src={src}
              controls
              style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: "0.75rem",
                objectFit: "cover",
                maxHeight: 180
              }}
            />
          );
        }
        return (
          <img
            src={src}
            alt={item.title}
            style={{
              width: "100%",
              borderRadius: "8px",
              marginBottom: "0.75rem",
              objectFit: "cover",
              maxHeight: 180
            }}
          />
        );
      })()}
      {item.video_url && (
        <video
          src={item.video_url}
          controls
          style={{ width: "100%", borderRadius: "8px", marginBottom: "0.75rem", maxHeight: 180 }}
        />
      )}
      <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.25rem" }}>{item.title}</div>
      <div style={{ color: "#aaa", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{item.category}</div>
      <div style={{ fontSize: "0.85rem", color: "#888" }}>{item.size}</div>
    </div>
  );

  // Edit modal
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    size: "",
    image_url: "",
    file: null,
    website: false,
    websiteUrl: "",
  });

  useEffect(() => {
    if (editItem) {
      setEditForm({
        title: editItem.title,
        category: editItem.category,
        size: editItem.size,
        image_url: editItem.image_url,
        file: null,
        website: !!editItem.website,
        websiteUrl: editItem.website || "",
      });
    }
  }, [editItem]);

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4"
    ];
    const maxSize = 25 * 1024 * 1024; // 25MB

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG, WEBP images and MP4 videos are allowed.");
      return null;
    }
    if (file.size > maxSize) {
      alert("File size must be 25MB or less.");
      return null;
    }

    const bucket = "portfolio-media";
    const filePath = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData?.publicUrl || null;
  };

  const renderEditModal = () => {
    if (!editItem) return null;
    return (
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000
        }}
      >
        <div
          style={{
            background: "#191919",
            padding: "2rem",
            borderRadius: "12px",
            minWidth: "320px",
            color: "#fff",
            textAlign: "center",
            boxShadow: "0 2px 16px rgba(0,0,0,0.25)"
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>Edit Portfolio Item</h3>
          <form
            onSubmit={async e => {
              e.preventDefault();
              let imageUrl = editForm.image_url;
              if (editForm.file) {
                const uploadedUrl = await handleImageUpload(editForm.file);
                if (uploadedUrl) imageUrl = uploadedUrl;
              }
              handleEditSave({ ...editItem, ...editForm, image_url: imageUrl });
            }}
            style={{ marginTop: "1rem", textAlign: "left" }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <label>Title:</label>
              <input
                type="text"
                value={editForm.title}
                onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                required
              />
            </div>
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                id="editIsWebsite"
                checked={editForm.website}
                onChange={e => setEditForm(f => ({ ...f, website: e.target.checked, websiteUrl: e.target.checked ? f.websiteUrl : "" }))}
                style={{ marginRight: 8 }}
              />
              <label htmlFor="editIsWebsite" style={{ margin: 0 }}>Website</label>
              {editForm.website && (
                <input
                  type="text"
                  placeholder="Enter website URL"
                  value={editForm.websiteUrl}
                  onChange={e => setEditForm(f => ({ ...f, websiteUrl: e.target.value }))}
                  style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              )}
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>Category:</label>
              <input
                type="text"
                value={editForm.category}
                onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                required
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>Size:</label>
              <select
                value={editForm.size}
                onChange={e => setEditForm(f => ({ ...f, size: e.target.value }))}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                required
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>Image URL:</label>
              <input
                type="text"
                value={editForm.image_url}
                onChange={e => setEditForm(f => ({ ...f, image_url: e.target.value }))}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>Change Image/Video:</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4"
                onChange={e => setEditForm(f => ({ ...f, file: e.target.files[0] }))}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", background: "#fff" }}
              />
              {editForm.file && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#aaa" }}>
                  Selected: {editForm.file.name}
                </div>
              )}
            </div>
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button
                type="submit"
                style={{
                  background: "#0057ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.5rem 1.5rem",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                style={{
                  background: "#232323",
                  color: "#fff",
                  border: "1px solid #888",
                  borderRadius: "4px",
                  padding: "0.5rem 1.5rem",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Confirm delete modal
  const renderDeleteModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000
      }}
    >
      <div
        style={{
          background: "#191919",
          padding: "2rem",
          borderRadius: "12px",
          minWidth: "320px",
          color: "#fff",
          textAlign: "center",
          boxShadow: "0 2px 16px rgba(0,0,0,0.25)"
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Confirm Delete</h3>
        <p>Are you sure you want to delete this portfolio item?</p>
        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            onClick={confirmDelete}
            style={{
              background: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem 1.5rem",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Delete
          </button>
          <button
            onClick={() => setDeleteId(null)}
            style={{
              background: "#232323",
              color: "#fff",
              border: "1px solid #888",
              borderRadius: "4px",
              padding: "0.5rem 1.5rem",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Modal for add new item
  const renderModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: "#191919",
          padding: "2.5rem 2rem",
          borderRadius: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
          minWidth: "320px",
          color: "var(--main-color)",
          fontFamily: '"DM Sans", sans-serif',
          textAlign: "center",
          position: "relative",
          maxWidth: 400,
          width: "100%"
        }}
      >
        <button
          onClick={() => setModalOpen(false)}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            color: "#fff",
            cursor: "pointer"
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-color)" }}>Add Portfolio Item</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem", textAlign: "left" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              id="isWebsite"
              checked={website}
              onChange={e => {
                setWebsite(e.target.checked);
                if (!e.target.checked) setWebsiteUrl("");
              }}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="isWebsite" style={{ margin: 0 }}>Website</label>
            {website && (
              <input
                type="text"
                placeholder="Enter website URL"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            )}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Image/Video Upload:</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 4))}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", background: "#fff" }}
              required
            />
            {files && files.length > 0 && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#aaa", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {files.map((f, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, marginBottom: 2, border: "1px solid #ccc" }}
                    />
                    <span style={{ fontSize: "0.8em", maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Size:</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
              required
            >
              <option value="normal">Normal</option>
              <option value="large">Large</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#0057ff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem 1.5rem",
              cursor: "pointer",
              width: "100%",
              fontWeight: 600,
            }}
          >
            {loading ? "Adding..." : "Add Portfolio Item"}
          </button>
          {success && <div style={{ color: "limegreen", marginTop: "1rem" }}>{success}</div>}
          {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
        </form>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--body-background)",
        color: "var(--main-color)",
        fontFamily: '"DM Sans", sans-serif',
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        overflowX: "hidden"
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          background: "#181818",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "2rem 1rem",
          boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
          zIndex: 2
        }}
      >
        <h2
          style={{
            color: "var(--primary-color)",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            letterSpacing: "1px",
            marginBottom: "2rem",
            fontSize: "1.3rem"
          }}
        >
          Admin
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            background: "#0057ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1rem",
            marginBottom: "1rem",
            width: "100%"
          }}
        >
          + Add New Item
        </button>
        <button
          onClick={handleLogout}
          style={{
            background: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1rem",
            width: "100%"
          }}
        >
          Logout
        </button>
      </div>
      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: "2.5rem 2rem",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100vw",
          overflowX: "auto"
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "var(--primary-color)",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          Portfolio Items
        </h2>
        {fetching ? (
          <div>Loading...</div>
        ) : (
          <div style={{ width: "100%" }}>
            <DragDropContext
              onDragEnd={async (result) => {
                if (!result.destination) return;
                const reordered = Array.from(projects);
                const [removed] = reordered.splice(result.source.index, 1);
                reordered.splice(result.destination.index, 0, removed);

                // Update order in state
                setProjects(reordered);

                // Persist order to Supabase
                await Promise.all(
                  reordered.map((item, idx) =>
                    supabase
                      .from("projects")
                      .update({ order: idx })
                      .eq("id", item.id)
                  )
                );
              }}
            >
              <Droppable droppableId="portfolio-list" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1rem",
                      width: "100%",
                      justifyContent: "flex-start",
                      alignItems: "stretch",
                      minHeight: 420,
                    }}
                  >
                    {projects.map((item, idx) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.7 : 1,
                              cursor: "grab",
                              minWidth: 260,
                              maxWidth: 320,
                              userSelect: "none"
                            }}
                          >
                            {renderCard(item, idx)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>
      {modalOpen && renderModal()}
      {deleteId && renderDeleteModal()}
      {editItem && renderEditModal()}
    </div>
  );
};

export default AdminDashboard;