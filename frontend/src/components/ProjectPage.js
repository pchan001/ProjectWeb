import React, { useEffect, useState } from "react";
import api from "../api";

const emptyProject = {
  Pnumber: "",
  Pname: "",
  Plocation: "",
  Dnum: "",
};

function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);

  const loadProjects = async () => {
    const res = await api.get("/api/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId === null) {
      await api.post("/api/projects", {
        ...form,
        Pnumber: Number(form.Pnumber),
        Dnum: Number(form.Dnum),
      });
    } else {
      await api.put(`/api/projects/${editingId}`, {
        ...form,
        Dnum: Number(form.Dnum),
      });
    }
    setForm(emptyProject);
    setEditingId(null);
    loadProjects();
  };

  const handleEdit = (p) => {
    setForm({
      Pnumber: p.Pnumber,
      Pname: p.Pname,
      Plocation: p.Plocation || "",
      Dnum: p.Dnum,
    });
    setEditingId(p.Pnumber);
  };

  const handleDelete = async (pnumber) => {
    if (!window.confirm("Delete this project?")) return;
    await api.delete(`/api/projects/${pnumber}`);
    loadProjects();
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Projects</div>
          <div className="card-subtitle">
            Track projects, owning department and location
          </div>
        </div>
        <span className="badge">{projects.length} records</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Pnumber</label>
            <input
              name="Pnumber"
              value={form.Pnumber}
              onChange={handleChange}
              disabled={editingId !== null}
              required
            />
          </div>
          <div className="form-field">
            <label>Pname</label>
            <input
              name="Pname"
              value={form.Pname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Plocation</label>
            <input
              name="Plocation"
              value={form.Plocation}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Dnum (Dept #)</label>
            <input
              name="Dnum"
              value={form.Dnum}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId === null ? "Create Project" : "Update Project"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setForm(emptyProject);
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Pnumber</th>
            <th>Pname</th>
            <th>Plocation</th>
            <th>Dnum</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.Pnumber}>
              <td>{p.Pnumber}</td>
              <td>{p.Pname}</td>
              <td>{p.Plocation}</td>
              <td>{p.Dnum}</td>
              <td>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(p.Pnumber)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan="5">No projects yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectPage;
