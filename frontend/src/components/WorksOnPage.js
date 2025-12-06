import React, { useEffect, useState } from "react";
import api from "../api";

const emptyAssignment = {
  Essn: "",
  Pno: "",
  Hours: "",
};

function WorksOnPage() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState(emptyAssignment);
  const [editingKey, setEditingKey] = useState(null);

  const loadAssignments = async () => {
    const res = await api.get("/api/works-on");
    setAssignments(res.data);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Essn || !form.Pno || form.Hours === "") return;

    if (editingKey === null) {
      await api.post("/api/works-on", {
        Essn: form.Essn,
        Pno: Number(form.Pno),
        Hours: Number(form.Hours),
      });
    } else {
      await api.put(
        `/api/works-on/${editingKey.Essn}/${editingKey.Pno}`,
        {
          Hours: Number(form.Hours),
        }
      );
    }

    setForm(emptyAssignment);
    setEditingKey(null);
    loadAssignments();
  };

  const handleEdit = (row) => {
    setForm({
      Essn: row.Essn,
      Pno: row.Pno,
      Hours: row.Hours,
    });
    setEditingKey({ Essn: row.Essn, Pno: row.Pno });
  };

  const handleDelete = async (Essn, Pno) => {
    if (!window.confirm("Delete this work assignment?")) return;
    await api.delete(`/api/works-on/${Essn}/${Pno}`);
    loadAssignments();
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Works On</div>
          <div className="card-subtitle">
            Manage how many hours employees are assigned to projects
          </div>
        </div>
        <span className="badge">{assignments.length} records</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Employee SSN (Essn)</label>
            <input
              name="Essn"
              value={form.Essn}
              onChange={handleChange}
              disabled={editingKey !== null}
              required
            />
          </div>
          <div className="form-field">
            <label>Project # (Pno)</label>
            <input
              name="Pno"
              value={form.Pno}
              onChange={handleChange}
              disabled={editingKey !== null}
              required
            />
          </div>
          <div className="form-field">
            <label>Hours</label>
            <input
              name="Hours"
              type="number"
              step="0.1"
              value={form.Hours}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingKey === null
              ? "Create Assignment"
              : "Update Hours"}
          </button>
          {editingKey !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setForm(emptyAssignment);
                setEditingKey(null);
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
            <th>Essn</th>
            <th>Pno</th>
            <th>Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((row) => (
            <tr key={`${row.Essn}-${row.Pno}`}>
              <td>{row.Essn}</td>
              <td>{row.Pno}</td>
              <td>{row.Hours}</td>
              <td>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleEdit(row)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handleDelete(row.Essn, row.Pno)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {assignments.length === 0 && (
            <tr>
              <td colSpan="4">No assignments yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default WorksOnPage;
