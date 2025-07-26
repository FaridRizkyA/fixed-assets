// frontend/components/layout/Sidebar.jsx
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaUserCog,
  FaFileAlt,
  FaExchangeAlt,
  FaTrashAlt,
  FaCalculator,
} from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      style={{
        width: "260px",
        backgroundColor: "#212529ff",
        color: "#fff",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-in-out",
        overflowX: "hidden",
        padding: isOpen ? "1rem" : "0"
      }}
    >
      {isOpen && (
        <>
          <h4 className="mb-4">
            <Link to="/dashboard" className="text-white text-decoration-none">
              PT. Cipta Kargo
            </Link>
          </h4>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/dashboard" className="text-white">
              <FaTachometerAlt className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/pengadaan" className="text-white">
              <FaPlusCircle className="me-2" /> Pengadaan Aset
            </Nav.Link>
            <Nav.Link as={Link} to="/penempatan" className="text-white">
              <FaExchangeAlt className="me-2" /> Penempatan Aset
            </Nav.Link>
            <Nav.Link as={Link} to="/penyusutan" className="text-white">
              <FaCalculator className="me-2" /> Penyusutan Aset
            </Nav.Link>
            <Nav.Link as={Link} to="/penghapusan" className="text-white">
              <FaTrashAlt className="me-2" /> Penghapusan Aset
            </Nav.Link>
            <Nav.Link as={Link} to="/dokumen" className="text-white">
              <FaFileAlt className="me-2" /> Dokumen Aset
            </Nav.Link>
            <Nav.Link as={Link} to="/user" className="text-white">
              <FaUserCog className="me-2" /> Manajemen User
            </Nav.Link>
          </Nav>
        </>
      )}
    </div>
  );
};

export default Sidebar;