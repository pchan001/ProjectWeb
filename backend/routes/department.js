const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all departments
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM DEPARTMENT");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET department by Dnumber
router.get("/:dnumber", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM DEPARTMENT WHERE Dnumber = ?",
      [req.params.dnumber]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE department
router.post("/", async (req, res) => {
  const { Dnumber, Dname, Mgr_ssn, Mgr_start_date } = req.body;
  try {
    await pool.query(
      "INSERT INTO DEPARTMENT (Dnumber, Dname, Mgr_ssn, Mgr_start_date) VALUES (?, ?, ?, ?)",
      [Dnumber, Dname, Mgr_ssn || null, Mgr_start_date || null]
    );
    res.status(201).json({ message: "Department created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE department
router.put("/:dnumber", async (req, res) => {
  const { Dname, Mgr_ssn, Mgr_start_date } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE DEPARTMENT SET Dname = ?, Mgr_ssn = ?, Mgr_start_date = ? WHERE Dnumber = ?",
      [Dname, Mgr_ssn || null, Mgr_start_date || null, req.params.dnumber]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Not found" });
    res.json({ message: "Department updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE department (will cascade to DEPT_LOCATIONS and PROJECT via FKs)
router.delete("/:dnumber", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM DEPARTMENT WHERE Dnumber = ?",
      [req.params.dnumber]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Not found" });
    res.json({ message: "Department deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
