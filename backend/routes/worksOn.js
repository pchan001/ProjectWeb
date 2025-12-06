// backend/routes/worksOn.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all assignments
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM WORKS_ON");
    res.json(rows);
  } catch (err) {
    console.error("GET /works-on error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET assignments by employee
router.get("/employee/:essn", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM WORKS_ON WHERE Essn = ?",
      [req.params.essn]
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /works-on/employee/:essn error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET assignments by project
router.get("/project/:pno", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM WORKS_ON WHERE Pno = ?",
      [req.params.pno]
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /works-on/project/:pno error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE assignment
router.post("/", async (req, res) => {
  const { Essn, Pno, Hours } = req.body;
  if (!Essn || !Pno || Hours == null) {
    return res
      .status(400)
      .json({ error: "Essn, Pno and Hours are required" });
  }

  try {
    await pool.query(
      "INSERT INTO WORKS_ON (Essn, Pno, Hours) VALUES (?, ?, ?)",
      [Essn, Pno, Hours]
    );
    res.status(201).json({ message: "Assignment created" });
  } catch (err) {
    console.error("POST /works-on error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE assignment hours
router.put("/:essn/:pno", async (req, res) => {
  const { Hours } = req.body;
  if (Hours == null) {
    return res.status(400).json({ error: "Hours is required" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE WORKS_ON SET Hours = ? WHERE Essn = ? AND Pno = ?",
      [Hours, req.params.essn, req.params.pno]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Assignment not found" });
    res.json({ message: "Assignment updated" });
  } catch (err) {
    console.error("PUT /works-on/:essn/:pno error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE assignment
router.delete("/:essn/:pno", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM WORKS_ON WHERE Essn = ? AND Pno = ?",
      [req.params.essn, req.params.pno]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Assignment not found" });
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    console.error("DELETE /works-on/:essn/:pno error", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
