// backend/routes/dependent.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all dependents
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM DEPENDENT");
    res.json(rows);
  } catch (err) {
    console.error("GET /dependents error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET dependents by employee
router.get("/employee/:essn", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM DEPENDENT WHERE Essn = ?",
      [req.params.essn]
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /dependents/employee/:essn error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET specific dependent
router.get("/:essn/:name", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM DEPENDENT WHERE Essn = ? AND Dependent_name = ?",
      [req.params.essn, req.params.name]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Dependent not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /dependents/:essn/:name error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE dependent
router.post("/", async (req, res) => {
  const { Essn, Dependent_name, Sex, Bdate, Relationship } = req.body;
  if (!Essn || !Dependent_name) {
    return res
      .status(400)
      .json({ error: "Essn and Dependent_name are required" });
  }

  try {
    await pool.query(
      `INSERT INTO DEPENDENT
       (Essn, Dependent_name, Sex, Bdate, Relationship)
       VALUES (?, ?, ?, ?, ?)`,
      [Essn, Dependent_name, Sex || null, Bdate || null, Relationship || null]
    );
    res.status(201).json({ message: "Dependent created" });
  } catch (err) {
    console.error("POST /dependents error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE dependent
router.put("/:essn/:name", async (req, res) => {
  const { Sex, Bdate, Relationship } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE DEPENDENT
       SET Sex = ?, Bdate = ?, Relationship = ?
       WHERE Essn = ? AND Dependent_name = ?`,
      [Sex || null, Bdate || null, Relationship || null, req.params.essn, req.params.name]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Dependent not found" });
    res.json({ message: "Dependent updated" });
  } catch (err) {
    console.error("PUT /dependents/:essn/:name error", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE dependent
router.delete("/:essn/:name", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM DEPENDENT WHERE Essn = ? AND Dependent_name = ?",
      [req.params.essn, req.params.name]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Dependent not found" });
    res.json({ message: "Dependent deleted" });
  } catch (err) {
    console.error("DELETE /dependents/:essn/:name error", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
