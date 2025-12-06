// src/App.js
import React, { useState } from "react";
import "./App.css";
import DepartmentPage from "./components/DepartmentPage";
import DeptLocationsPage from "./components/DeptLocationsPage";
import ProjectPage from "./components/ProjectPage";
import WorksOnPage from "./components/WorksOnPage";
import DependentPage from "./components/DependentPage";
import DocumentsPage from "./components/DocumentsPage";


const tabs = [
  { id: "departments", label: "Departments" },
  { id: "deptLocations", label: "Dept Locations" },
  { id: "projects", label: "Projects" },
  { id: "worksOn", label: "Works On" },
  { id: "dependents", label: "Dependents" },
  { id: "documents", label: "Documents" }, // NEW  
];

function App() {
  const [activeTab, setActiveTab] = useState("departments");

  const renderTabContent = () => {
    switch (activeTab) {
      case "departments":
        return <DepartmentPage />;
      case "deptLocations":
        return <DeptLocationsPage />;
      case "projects":
        return <ProjectPage />;
      case "worksOn":
        return <WorksOnPage />;
      case "dependents":
        return <DependentPage />;
	  case "documents":
        return <DocumentsPage />;	
      default:
        return <DepartmentPage />;
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-title">SWE4633-Cloud Software Dev Project</div>
        <nav className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={
                "nav-tab" + (activeTab === tab.id ? " active" : "")
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-content">{renderTabContent()}</main>
    </div>
  );
}

export default App;
