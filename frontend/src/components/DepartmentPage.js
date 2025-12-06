// src/components/DepartmentPage.js
import React, { useEffect, useState } from "react";
import api from "../api";

const emptyDept = {
  Dnumber: "",
  Dname: "",
  Mgr_ssn: "",
  Mgr_start_date: "",
};

function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyDept);
  const [editingId, setEditingId] = useState(null);

  const loadDepartments = async () => {
    const res = await api.get("/api/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId === null) {
      await api.post("/api/departments", {
        ...form,
        Dnumber: Number(form.Dnumber),
      });
    } else {
      await api.put(`/api/departments/${editingId}`, form);
    }
    setForm(emptyDept);
    setEditingId(null);
    loadDepartments();
  };

  const handleEdit = (dept) => {
    setForm({
      Dnumber: dept.Dnumber,
      Dname: dept.Dname,
      Mgr_ssn: dept.Mgr_ssn || "",
      Mgr_start_date: dept.Mgr_start_date
        ? dept.Mgr_start_date.substring(0, 10)
        : "",
    });
    setEditingId(dept.Dnumber);
  };

  const handleDelete = async (dnumber) => {
    if (!window.confirm("Delete this department?")) return;
    await api.delete(`/api/departments/${dnumber}`);
    loadDepartments();
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Departments</div>
          <div className="card-subtitle">
            Manage department metadata and managers
          </div>
        </div>
        <span className="badge">{departments.length} records</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Dnumber</label>
            <input
              name="Dnumber"
              value={form.Dnumber}
              onChange={handleChange}
              disabled={editingId !== null}
              required
            />
          </div>
          <div className="form-field">
            <label>Dname</label>
            <input
              name="Dname"
              value={form.Dname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Manager SSN</label>
            <input
              name="Mgr_ssn"
              value={form.Mgr_ssn}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Manager Start Date</label>
            <input
              type="date"
              name="Mgr_start_date"
              value={form.Mgr_start_date}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId === null ? "Create Department" : "Update Department"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setForm(emptyDept);
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
            <th>Dnumber</th>
            <th>Dname</th>
            <th>Mgr_ssn</th>
            <th>Mgr_start_date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.Dnumber}>
              <td>{d.Dnumber}</td>
              <td>{d.Dname}</td>
              <td>{d.Mgr_ssn}</td>
              <td>{d.Mgr_start_date?.substring(0, 10)}</td>
              <td>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleEdit(d)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(d.Dnumber)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {departments.length === 0 && (
            <tr>
              <td colSpan="5">No departments yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DepartmentPage;
