import React, { useEffect, useState } from "react";
import api from "../api";

function formatBytes(bytes) {
  if (bytes === 0 || bytes == null) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function DocumentsPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadFiles = async () => {
    const res = await api.get("/api/files");
    setFiles(res.data);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please choose a file first.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      await api.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSelectedFile(null);
      (document.getElementById("file-input") || {}).value = "";
      await loadFiles();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Check console or server logs.");
    } finally {
      setUploading(false);
    }
  };

  const handleView = (file) => {
    if (!file.url) return;
    window.open(file.url, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (file) => {
    if (
      !window.confirm(
        `Delete file "${file.key}" from S3? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await api.delete(`/api/files/${encodeURIComponent(file.key)}`);
      await loadFiles();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed. Check console or server logs.");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Documents</div>
          <div className="card-subtitle">
            Upload, view, and manage files stored in your S3 bucket
          </div>
        </div>
        <span className="badge">{files.length} files</span>
      </div>

      {/* Upload Section */}
      <form onSubmit={handleUpload} style={{ marginBottom: "1rem" }}>
        <div className="form-grid">
          <div className="form-field">
            <label>Choose File</label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
          {selectedFile && !uploading && (
            <span style={{ fontSize: "0.8rem", marginLeft: "0.5rem" }}>
              Selected: <strong>{selectedFile.name}</strong>
            </span>
          )}
        </div>
      </form>

      {/* Files Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>File Name (Key)</th>
            <th>Size</th>
            <th>Last Modified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f.key}>
              <td>{f.key}</td>
              <td>{formatBytes(f.size)}</td>
              <td>
                {f.lastModified
                  ? new Date(f.lastModified).toLocaleString()
                  : ""}
              </td>
              <td>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleView(f)}
                >
                  View
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(f)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {files.length === 0 && (
            <tr>
              <td colSpan="4">No documents found in the bucket.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentsPage;
