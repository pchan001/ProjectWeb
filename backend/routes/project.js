// backend/routes/project.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all projects
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM PROJECT");
    res.json(rows);
  } catch (err) {
    console.error("GET /projects error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET project by Pnumber
router.get("/:pnumber", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM PROJECT WHERE Pnumber = ?",
      [req.params.pnumber]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /projects/:pnumber error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE project
router.post("/", async (req, res) => {
  const { Pnumber, Pname, Plocation, Dnum } = req.body;
  if (!Pnumber || !Pname || !Dnum) {
    return res
      .status(400)
      .json({ error: "Pnumber, Pname and Dnum are required" });
  }

  try {
    await pool.query(
      "INSERT INTO PROJECT (Pnumber, Pname, Plocation, Dnum) VALUES (?, ?, ?, ?)",
      [Pnumber, Pname, Plocation || null, Dnum]
    );
    res.status(201).json({ message: "Project created" });
  } catch (err) {
    console.error("POST /projects error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE project
router.put("/:pnumber", async (req, res) => {
  const { Pname, Plocation, Dnum } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE PROJECT
       SET Pname = ?, Plocation = ?, Dnum = ?
       WHERE Pnumber = ?`,
      [Pname, Plocation || null, Dnum, req.params.pnumber]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Not found" });
    res.json({ message: "Project updated" });
  } catch (err) {
    console.error("PUT /projects/:pnumber error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE project
router.delete("/:pnumber", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM PROJECT WHERE Pnumber = ?",
      [req.params.pnumber]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("DELETE /projects/:pnumber error", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
