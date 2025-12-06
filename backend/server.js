// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const departmentRoutes = require("./routes/department");
const employeeRoutes = require("./routes/employee");
const deptLocationsRoutes = require("./routes/deptLocations");
const projectRoutes = require("./routes/project");
const worksOnRoutes = require("./routes/worksOn");
const dependentRoutes = require("./routes/dependent");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/dept-locations", deptLocationsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/works-on", worksOnRoutes);
app.use("/api/dependents", dependentRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const fileRoutes = require("./routes/files");
app.use("/api/files", fileRoutes);
