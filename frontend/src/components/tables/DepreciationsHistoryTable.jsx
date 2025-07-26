import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function DepreciationsHistoryTable({ refreshTrigger }) {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [yearOptions, setYearOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    fetchOldestYear();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/depreciations/history");
      setData(res.data);
    } catch (err) {
      console.error("Gagal mengambil riwayat penyusutan:", err);
    }
  };

  const fetchOldestYear = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assets/oldest-year");
      const oldestYear = res.data.oldest || new Date().getFullYear();
      const currentYear = new Date().getFullYear();
      const options = [];
      for (let i = currentYear; i >= oldestYear; i--) {
        options.push(i);
      }
      setYearOptions(options);
    } catch (err) {
      console.error("Gagal mengambil tahun tertua:", err);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toISOString().split("T")[0];
  const formatCurrency = (val) => `Rp ${Number(val).toLocaleString("id-ID")}`;

  const filtered = data.filter((item) => {
    const date = new Date(item.depreciation_date);
    const matchMonth = month ? date.getMonth() + 1 === parseInt(month) : true;
    const matchYear = year ? date.getFullYear() === parseInt(year) : true;
    const matchSearch =
      item.asset_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.asset_code.toLowerCase().includes(searchText.toLowerCase());

    return matchMonth && matchYear && matchSearch;
  });

  const columns = [
    { name: "#", selector: (_, i) => i + 1, width: "60px" },
    { name: "Kode Aset", selector: (row) => row.asset_code },
    { name: "Nama Aset", selector: (row) => row.asset_name },
    { name: "Tanggal", selector: (row) => formatDate(row.depreciation_date) },
    { name: "Penyusutan", selector: (row) => formatCurrency(row.depreciation_amount) },
    { name: "Akumulasi", selector: (row) => formatCurrency(row.accumulated_depreciation) },
    { name: "Nilai Buku", selector: (row) => formatCurrency(row.book_value) },
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

  const handlePrint = () => {
    if (filtered.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }

    navigate("/print/riwayatPenyusutan", {
      state: {
        data: filtered,
        month,
        year
      }
    });
  };

  return (
    <>
      <h5 className="mb-3">Riwayat Penyusutan Aset</h5>
      <Row className="mb-3 align-items-end justify-content-between">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Cari Aset</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nama atau kode aset"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Bulan</Form.Label>
                <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
                  <option value="">Semua</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tahun</Form.Label>
                <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Semua</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end justify-content-end">
              <Button className="mt-2" onClick={handlePrint} variant="success">
                Cetak Laporan
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

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

export default DepreciationsHistoryTable;