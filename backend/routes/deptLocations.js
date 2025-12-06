// backend/routes/deptLocations.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all locations
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM DEPT_LOCATIONS");
    res.json(rows);
  } catch (err) {
    console.error("GET /dept-locations error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET locations for a department
router.get("/:dnumber", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM DEPT_LOCATIONS WHERE Dnumber = ?",
      [req.params.dnumber]
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /dept-locations/:dnumber error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE a department location
router.post("/", async (req, res) => {
  const { Dnumber, Dlocation } = req.body;
  if (!Dnumber || !Dlocation) {
    return res.status(400).json({ error: "Dnumber and Dlocation are required" });
  }

  try {
    await pool.query(
      "INSERT INTO DEPT_LOCATIONS (Dnumber, Dlocation) VALUES (?, ?)",
      [Dnumber, Dlocation]
    );
    res.status(201).json({ message: "Department location created" });
  } catch (err) {
    console.error("POST /dept-locations error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE a location (change Dlocation only)
router.put("/:dnumber/:dlocation", async (req, res) => {
  const { NewLocation } = req.body;
  if (!NewLocation) {
    return res.status(400).json({ error: "NewLocation is required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE DEPT_LOCATIONS
       SET Dlocation = ?
       WHERE Dnumber = ? AND Dlocation = ?`,
      [NewLocation, req.params.dnumber, req.params.dlocation]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json({ message: "Location updated" });
  } catch (err) {
    console.error("PUT /dept-locations error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE a location
router.delete("/:dnumber/:dlocation", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM DEPT_LOCATIONS WHERE Dnumber = ? AND Dlocation = ?",
      [req.params.dnumber, req.params.dlocation]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json({ message: "Location deleted" });
  } catch (err) {
    console.error("DELETE /dept-locations error", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
