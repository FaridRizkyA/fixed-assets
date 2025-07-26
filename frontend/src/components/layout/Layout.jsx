import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Sidebar from "./Sidebar";
import TopNavbar from "./Navbar";
import DepreciationChecker from "./DepreciationChecker";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <DepreciationChecker />
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-grow-1" style={{ marginLeft: sidebarOpen ? "260px" : "0", transition: "margin-left 0.3s ease-in-out" }}>
        <TopNavbar onToggle={handleToggle} />
        <Container fluid className="p-4">
          {children}
        </Container>
      </div>
    </div>
  );
}

export default Layout;