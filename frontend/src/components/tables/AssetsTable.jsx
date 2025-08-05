import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Form, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EditAssetModal from "../modals/EditAssetModal";

function AssetsTable({ refreshTrigger }) {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [year, setYear] = useState("");
  const [yearOptions, setYearOptions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchOldestYear();
  }, []);

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/assets");
      setData(res.data);
    } catch (err) {
      console.error("Gagal mengambil data aset:", err);
    }
  };

  const fetchOldestYear = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/assets/oldest-year");
      const oldest = res.data.oldest || new Date().getFullYear();
      const current = new Date().getFullYear();
      const options = [];
      for (let i = current; i >= oldest; i--) {
        options.push(i);
      }
      setYearOptions(options);
    } catch (err) {
      console.error("Gagal mengambil tahun tertua:", err);
    }
  };

  const filtered = data.filter((item) => {
    const matchSearch =
      item.asset_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.asset_code.toLowerCase().includes(searchText.toLowerCase());

    const matchYear = year
      ? new Date(item.acquisition_date).getFullYear() === parseInt(year)
      : true;

    return matchSearch && matchYear;
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case "available":
        return <Badge bg="primary">Tersedia</Badge>;
      case "in_use":
        return <Badge bg="success">Digunakan</Badge>;
      case "disposal":
        return <Badge bg="danger">Dihapus</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handlePrint = () => {
    if (filtered.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }

    navigate("/print/pengadaanAset", {
      state: {
        data: filtered,
        printedBy: JSON.parse(localStorage.getItem("user"))?.username || "Pengguna",
        printedAt: new Date().toLocaleString("id-ID"),
      },
    });
  };

  const formatCurrency = (val) =>
    typeof val === "number"
      ? `Rp ${val.toLocaleString("id-ID")}`
      : `Rp ${Number(val).toLocaleString("id-ID")}`;

  const formatDate = (val) =>
    val ? new Date(val).toLocaleDateString("id-ID") : "-";

  const role = JSON.parse(localStorage.getItem("user"))?.role;

  const baseColumns = [
    { name: "#", selector: (_, i) => i + 1, width: "60px" },
    { name: "Kode Aset", selector: (row) => row.asset_code },
    { name: "Nama Aset", selector: (row) => row.asset_name },
    { name: "Kategori", selector: (row) => row.category_name || "-" },
    { name: "Tanggal Perolehan", selector: (row) => formatDate(row.acquisition_date) },
    { name: "Harga Perolehan", selector: (row) => formatCurrency(row.acquisition_cost) },
    { name: "Lokasi", selector: (row) => row.location },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => renderStatusBadge(row.status),
    },
  ];

  let columns = [...baseColumns];

  if (role === "admin" || role === "asset_manager") {
    columns.push({
      name: "Aksi",
      cell: (row) => (
        <Button
          variant="warning"
          size="sm"
          onClick={() => {
            setSelectedAsset(row);
            setShowEditModal(true);
          }}
        >
          Edit
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
        <h5 className="mb-0">Daftar Pengadaan Aset</h5>
        <div className="d-flex gap-2 align-items-end">
          <Form.Control
            type="text"
            placeholder="Cari aset..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ height: "36px", minWidth: "220px" }}
          />
          <Form.Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ height: "36px", minWidth: "130px" }}
          >
            <option value="">Semua Tahun</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Form.Select>
          <Button
            variant="success"
            onClick={handlePrint}
            style={{ height: "36px", padding: "4px 16px" }}
          >
            Cetak
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

      <EditAssetModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        asset={selectedAsset}
        onUpdated={fetchData}
      />

    </>
  );
}

export default AssetsTable;