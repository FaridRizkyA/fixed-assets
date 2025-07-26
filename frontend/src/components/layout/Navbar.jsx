import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function TopNavbar({ onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/pengadaan": "Pengadaan Aset",
    "/penempatan": "Penempatan Aset",
    "/penyusutan": "Penyusutan Aset",
    "/penghapusan": "Penghapusan Aset",
    "/dokumen": "Dokumen Aset",
    "/user": "Manajemen User"
  };

  const pageTitle = pageTitles[location.pathname] || "Aplikasi Aset";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Navbar bg="light" variant="light" className="px-4 shadow-sm">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Button variant="link" className="me-2 text-danger p-0" onClick={onToggle}>
            <FaBars size={18} />
          </Button>
          <span className="navbar-title fw-semibold">{pageTitle}</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="me-3 navbar-greeting">Hi, {user?.username}!</span>
          <Button size="sm" variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
