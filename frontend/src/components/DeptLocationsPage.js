import React, { useEffect, useState } from "react";
import api from "../api";

const emptyLocation = {
  Dnumber: "",
  Dlocation: "",
};

function DeptLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState(emptyLocation);
  // editingKey keeps original PK (Dnumber + original Dlocation)
  const [editingKey, setEditingKey] = useState(null);

  const loadLocations = async () => {
    const res = await api.get("/api/dept-locations");
    setLocations(res.data);
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Dnumber || !form.Dlocation) return;

    if (editingKey === null) {
      // create
      await api.post("/api/dept-locations", {
        Dnumber: Number(form.Dnumber),
        Dlocation: form.Dlocation,
      });
    } else {
      // update location name only
      await api.put(
        `/api/dept-locations/${editingKey.Dnumber}/${editingKey.Dlocation}`,
        {
          NewLocation: form.Dlocation,
        }
      );
    }

    setForm(emptyLocation);
    setEditingKey(null);
    loadLocations();
  };

  const handleEdit = (loc) => {
    setForm({
      Dnumber: loc.Dnumber,
      Dlocation: loc.Dlocation,
    });
    setEditingKey({
      Dnumber: loc.Dnumber,
      Dlocation: loc.Dlocation,
    });
  };

  const handleDelete = async (Dnumber, Dlocation) => {
    if (!window.confirm("Delete this department location?")) return;
    await api.delete(`/api/dept-locations/${Dnumber}/${Dlocation}`);
    loadLocations();
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Department Locations</div>
          <div className="card-subtitle">
            Manage physical locations associated with each department
          </div>
        </div>
        <span className="badge">{locations.length} records</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Dnumber</label>
            <input
              name="Dnumber"
              value={form.Dnumber}
              onChange={handleChange}
              disabled={editingKey !== null}
              required
            />
          </div>
          <div className="form-field">
            <label>Dlocation</label>
            <input
              name="Dlocation"
              value={form.Dlocation}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingKey === null ? "Add Location" : "Update Location"}
          </button>
          {editingKey !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setForm(emptyLocation);
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
            <th>Dnumber</th>
            <th>Dlocation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={`${loc.Dnumber}-${loc.Dlocation}`}>
              <td>{loc.Dnumber}</td>
              <td>{loc.Dlocation}</td>
              <td>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleEdit(loc)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handleDelete(loc.Dnumber, loc.Dlocation)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {locations.length === 0 && (
            <tr>
              <td colSpan="3">No locations defined yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DeptLocationsPage;
