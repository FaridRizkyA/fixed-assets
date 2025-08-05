import React, { useEffect, useState } from "react";
import { Card, Table, Badge } from "react-bootstrap";
import axios from "axios";

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function formatStatus(status) {
  switch (status) {
    case "available":
      return { label: "Tersedia", variant: "primary" };
    case "in_use":
      return { label: "Digunakan", variant: "success" };
    case "disposal":
      return { label: "Dihapus", variant: "danger" };
    default:
      return { label: status, variant: "light" };
  }
}

function AssetsHistoryTable() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/history");
        setAssets(res.data);
      } catch (err) {
        console.error("Gagal mengambil riwayat aset:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="shadow-sm mt-4">
      <div
        className="px-3 py-2 text-white fw-semibold"
        style={{
          backgroundColor: "#6c757d",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px"
        }}
      >
        Riwayat Aset
      </div>
      <Card.Body className="p-0">
        <Table striped responsive className="m-3">
          <thead className="text-left align-left">
            <tr>
              <th>Kode</th>
              <th>Nama Aset</th>
              <th>Kategori</th>
              <th>Nilai Perolehan</th>
              <th>Nilai Buku</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="align-left">
            {assets.map((item, index) => {
              const { label, variant } = formatStatus(item.status);
              return (
                <tr key={index}>
                  <td>{item.asset_code}</td>
                  <td>{item.asset_name}</td>
                  <td>{item.category_name}</td>
                  <td>{formatRupiah(item.acquisition_cost)}</td>
                  <td>{formatRupiah(item.book_value)}</td>
                  <td>
                    <Badge bg={variant}>{label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default AssetsHistoryTable;
