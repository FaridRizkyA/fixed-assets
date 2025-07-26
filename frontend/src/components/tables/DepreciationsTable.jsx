import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function DepreciationsTable({ refreshTrigger }) {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/depreciations/summary");
      setData(res.data);
    } catch (err) {
      console.error("Gagal mengambil ringkasan penyusutan:", err);
    }
  };

  const filtered = data.filter(
    item =>
      item.asset_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.asset_code.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePrint = () => {
      console.log("Data Ringkasan:", data);
    if (data.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }

    navigate("/print/ringkasanPenyusutan", {
      state: {
        data: filtered,
        printedBy: JSON.parse(localStorage.getItem("user"))?.username || "Pengguna",
        printedAt: new Date().toLocaleString("id-ID")
      }
    });
  };

  const formatCurrency = (val) => {
    const num = Number(val);
    return !isNaN(num) && typeof num === "number"
      ? `Rp ${num.toLocaleString("id-ID")}`
      : "Rp 0";
  };

  const columns = [
    { name: "#", selector: (_, i) => i + 1, width: "60px" },
    { name: "Kode Aset", selector: row => row.asset_code, sortable: true },
    { name: "Nama Aset", selector: row => row.asset_name },
    { name: "Kategori", selector: row => row.category_name || "-" },
    { name: "Harga Perolehan", selector: row => formatCurrency(row.acquisition_cost) },
    {
      name: "Akumulasi Penyusutan",
      selector: (row) =>
        row.accumulated_depreciation !== null && row.accumulated_depreciation !== undefined
          ? `Rp ${Number(row.accumulated_depreciation).toLocaleString("id-ID")}`
          : "-",
    },
    { name: "Nilai Buku", selector: row => formatCurrency(row.book_value) },
  ];

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
        <h5 className="mb-0">Ringkasan Penyusutan Aset</h5>
        <div className="d-flex gap-2 align-items-center">
          <Form.Control
            type="text"
            placeholder="Cari aset..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ height: "36px", padding: "4px 8px", minWidth: "250px" }}
          />
          <Button
            variant="success"
            onClick={handlePrint}
            style={{ height: "36px", padding: "4px 16px", width: "100%" }}
          >
            Cetak Laporan
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        responsive
        highlightOnHover
        noHeader
        customStyles={customStyles}
      />
    </>
  );
}

export default DepreciationsTable;