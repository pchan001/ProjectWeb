const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all employees
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM EMPLOYEE");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE employee
router.post("/", async (req, res) => {
  const {
    Ssn,
    Fname,
    Minit,
    Lname,
    Bdate,
    Address,
    Sex,
    Salary,
    Super_ssn,
    Dno,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO EMPLOYEE
       (Ssn, Fname, Minit, Lname, Bdate, Address, Sex, Salary, Super_ssn, Dno)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Ssn,
        Fname,
        Minit || null,
        Lname,
        Bdate || null,
        Address || null,
        Sex || null,
        Salary || null,
        Super_ssn || null,
        Dno || null,
      ]
    );
    res.status(201).json({ message: "Employee created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE / DELETE endpoints follow same pattern...
module.exports = router;
