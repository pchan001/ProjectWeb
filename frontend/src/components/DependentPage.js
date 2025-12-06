import React, { useEffect, useState } from "react";
import api from "../api";

const emptyDependent = {
  Essn: "",
  Dependent_name: "",
  Sex: "",
  Bdate: "",
  Relationship: "",
};

function DependentPage() {
  const [dependents, setDependents] = useState([]);
  const [form, setForm] = useState(emptyDependent);
  const [editingKey, setEditingKey] = useState(null);

  const loadDependents = async () => {
    const res = await api.get("/api/dependents");
    setDependents(res.data);
  };

  useEffect(() => {
    loadDependents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Essn || !form.Dependent_name) return;

    if (editingKey === null) {
      await api.post("/api/dependents", {
        Essn: form.Essn,
        Dependent_name: form.Dependent_name,
        Sex: form.Sex || null,
        Bdate: form.Bdate || null,
        Relationship: form.Relationship || null,
      });
    } else {
      await api.put(
        `/api/dependents/${editingKey.Essn}/${encodeURIComponent(
          editingKey.Dependent_name
        )}`,
        {
          Sex: form.Sex || null,
          Bdate: form.Bdate || null,
          Relationship: form.Relationship || null,
        }
      );
    }

    setForm(emptyDependent);
    setEditingKey(null);
    loadDependents();
  };

  const handleEdit = (row) => {
    setForm({
      Essn: row.Essn,
      Dependent_name: row.Dependent_name,
      Sex: row.Sex || "",
      Bdate: row.Bdate ? row.Bdate.substring(0, 10) : "",
      Relationship: row.Relationship || "",
    });
    setEditingKey({
      Essn: row.Essn,
      Dependent_name: row.Dependent_name,
    });
  };

  const handleDelete = async (Essn, Dependent_name) => {
    if (!window.confirm("Delete this dependent?")) return;
    await api.delete(
      `/api/dependents/${Essn}/${encodeURIComponent(
        Dependent_name
      )}`
    );
    loadDependents();
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Dependents</div>
          <div className="card-subtitle">
            Maintain dependent information for employees
          </div>
        </div>
        <span className="badge">{dependents.length} records</span>
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
            <label>Dependent Name</label>
            <input
              name="Dependent_name"
              value={form.Dependent_name}
              onChange={handleChange}
              disabled={editingKey !== null}
              required
            />
          </div>
          <div className="form-field">
            <label>Sex</label>
            <select
              name="Sex"
              value={form.Sex}
              onChange={handleChange}
            >
              <option value="">--</option>
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="O">O</option>
            </select>
          </div>
          <div className="form-field">
            <label>Birth Date</label>
            <input
              type="date"
              name="Bdate"
              value={form.Bdate}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Relationship</label>
            <input
              name="Relationship"
              value={form.Relationship}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingKey === null ? "Add Dependent" : "Update Dependent"}
          </button>
          {editingKey !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setForm(emptyDependent);
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
            <th>Dependent Name</th>
            <th>Sex</th>
            <th>Bdate</th>
            <th>Relationship</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dependents.map((row) => (
            <tr key={`${row.Essn}-${row.Dependent_name}`}>
              <td>{row.Essn}</td>
              <td>{row.Dependent_name}</td>
              <td>{row.Sex}</td>
              <td>{row.Bdate ? row.Bdate.substring(0, 10) : ""}</td>
              <td>{row.Relationship}</td>
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
                    handleDelete(row.Essn, row.Dependent_name)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {dependents.length === 0 && (
            <tr>
              <td colSpan="6">No dependents found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DependentPage;
