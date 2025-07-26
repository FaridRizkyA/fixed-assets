import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DisposalsTable({ refreshTrigger }) {
  const [disposals, setDisposals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const role = JSON.parse(localStorage.getItem("user"))?.role;

  useEffect(() => {
    fetchDisposals();
  }, [refreshTrigger]);

  const fetchDisposals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/disposals");
      setDisposals(res.data);
    } catch (err) {
      console.error("Gagal mengambil data disposals:", err);
    }
  };

  const handleRestore = async (id) => {
    const confirm = window.confirm("Pulihkan aset ini?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/disposals/${id}`);
      alert("Aset berhasil dipulihkan.");
      fetchDisposals();
    } catch (err) {
      console.error("Gagal memulihkan aset:", err);
      alert("Terjadi kesalahan saat memulihkan aset.");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toISOString().split("T")[0];

  const filteredData = disposals.filter(
    (item) =>
      item.asset_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.asset_code.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePrint = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }

    navigate("/print/penghapusanAset", {
      state: {
        data: filteredData,
        printedBy: JSON.parse(localStorage.getItem("user"))?.username || "Pengguna",
        printedAt: new Date().toLocaleString("id-ID"),
      },
    });
  };

  const baseColumns = [
    { name: "#", selector: (row, i) => i + 1, width: "60px" },
    { name: "Kode Aset", selector: (row) => row.asset_code, sortable: true },
    { name: "Nama Aset", selector: (row) => row.asset_name, sortable: true },
    { name: "Tanggal", selector: (row) => formatDate(row.disposal_date) },
    { name: "Jenis", selector: (row) => row.disposal_type },
    {
      name: "Nilai",
      selector: (row) =>
        row.disposal_value
          ? `Rp ${Number(row.disposal_value).toLocaleString("id-ID")}`
          : "-",
    },
    { name: "Catatan", selector: (row) => row.notes || "-" },
  ];

  // Tambahkan kolom aksi jika role sesuai
  let columns = [...baseColumns];

  if (role === "admin" || role === "asset_manager") {
    columns.push({
      name: "Aksi",
      cell: (row) => (
        <Button
          size="sm"
          variant="success"
          onClick={() => handleRestore(row.disposal_id)}
        >
          Pulihkan
        </Button>
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
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Daftar Penghapusan Aset</h5>
        <div className="d-flex gap-2 align-items-center">
        <Form.Control
          type="text"
          placeholder="Cari aset..."
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
    </>
  );
}

export default DisposalsTable;
