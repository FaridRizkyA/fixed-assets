import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Form, Badge } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditAssignmentModal from "../modals/EditAssignmentModal";

function AssignmentsTable({ refreshTrigger }) {
  const [assignments, setAssignments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const role = JSON.parse(localStorage.getItem("user"))?.role;
  const canEdit = role === "admin" || role === "asset_manager";

  useEffect(() => {
    fetchAssignments();
  }, [refreshTrigger]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error("Gagal mengambil data penempatan:", err);
    }
  };

  const handleReturn = async (assignmentId) => {
    const confirm = window.confirm("Tandai aset telah dikembalikan?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:5000/api/assignments/return/${assignmentId}`);
      alert("Aset berhasil dikembalikan.");
      fetchAssignments();
    } catch (err) {
      console.error("Gagal mengembalikan aset:", err);
      alert("Terjadi kesalahan saat mengembalikan aset.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString().split("T")[0];
  };

  const filteredData = assignments.filter((item) =>
    item.asset_name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.asset_code.toLowerCase().includes(searchText.toLowerCase()) ||
    item.assigned_user.toLowerCase().includes(searchText.toLowerCase()) ||
    item.department?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin menghapus penempatan ini?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      alert("Penempatan berhasil dihapus.");
      fetchAssignments();
    } catch (err) {
      console.error("Gagal menghapus penempatan:", err);
      alert("Terjadi kesalahan saat menghapus.");
    }
  };

  const handleEdit = (row) => {
    setSelectedItem(row);
    setShowEditModal(true);
  };

  const handleUpdated = () => {
    fetchAssignments();
    setShowEditModal(false);
  };

  const handlePrint = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }

    navigate("/print/penempatanAset", {
      state: {
        data: filteredData,
        printedBy: JSON.parse(localStorage.getItem("user"))?.username || "Pengguna",
        printedAt: new Date().toLocaleString("id-ID"),
      },
    });
  };

  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Kode Aset", selector: (row) => row.asset_code, sortable: true },
    { name: "Nama Aset", selector: (row) => row.asset_name },
    { name: "Penanggung Jawab", selector: (row) => row.assigned_user },
    { name: "Departemen", selector: (row) => row.department || "-" },
    {
      name: "Tanggal Penempatan",
      selector: (row) => formatDate(row.assigned_date),
    },
    {
      name: "Tanggal Kembali",
      cell: (row) =>
        row.return_date ? (
          formatDate(row.return_date)
        ) : canEdit ? (
          <Button
            size="sm"
            variant="success"
            style={{ minWidth: "90px" }}
            onClick={() => handleReturn(row.assignment_id)}
          >
            Returned
          </Button>
        ) : (
          "-"
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "140px",
    },
    {
      name: "Status",
      cell: (row) => (
        <Badge bg={row.return_date ? "secondary" : "info"}>
          {row.return_date ? "Dikembalikan" : "Digunakan"}
        </Badge>
      ),
    },
  ];

  if (canEdit) {
    columns.push({
      name: "Aksi",
      width: "160px",
      cell: (row) => (
        <div className="d-flex gap-1 flex-wrap">
          <Button
            size="sm"
            variant="warning"
            style={{ minWidth: "70px" }}
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            style={{ minWidth: "70px" }}
            onClick={() => handleDelete(row.assignment_id)}
          >
            Hapus
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    });
  }

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#000",
        color: "#fff",
        fontWeight: "bold",
      },
    },
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Riwayat Penempatan Aset</h5>
        <div className="d-flex gap-2 align-items-center">
          <Form.Control
            type="text"
            placeholder="Cari penempatan..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: "250px" }}
          />
          <Button
            variant="success"
            onClick={handlePrint}
            style={{ height: "36px", padding: "4px 16px" }}
          >
            Cetak Laporan
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        responsive
        highlightOnHover
        noHeader
        customStyles={customStyles}
      />

      {selectedItem && (
        <EditAssignmentModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          assignment={selectedItem}
          onUpdated={handleUpdated}
        />
      )}
    </>
  );
}

export default AssignmentsTable;