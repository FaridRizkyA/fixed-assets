import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/print.css";

function CetakDaftarAset() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data, printedBy, printedAt } = state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 300);

    window.addEventListener("afterprint", () => {
      navigate("/pengadaan");
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", () => {});
    };
  }, []);

  const formatCurrency = (val) =>
    typeof val === "number" || !isNaN(Number(val))
      ? `Rp ${Number(val).toLocaleString("id-ID")}`
      : "-";
    
  const formatStatus = (status) => {
    switch (status) {
      case "available":
        return "Tersedia";
      case "in_use":
        return "Digunakan";
      case "disposal":
        return "Dihapus";
      default:
        return status;
    }
  };

  if (!data) return <div>Data tidak tersedia.</div>;

  return (
    <div className="print-container">
      <div className="print-header">
        <h4>Laporan Pengadaan Aset</h4>
        <p>Dicetak oleh: {printedBy}</p>
        <p>Tanggal Cetak: {printedAt}</p>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Kode Aset</th>
            <th>Nama Aset</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Tanggal</th>
            <th>Lokasi</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{a.asset_code}</td>
              <td>{a.asset_name}</td>
              <td>{a.category_name}</td>
              <td>{formatCurrency(a.acquisition_cost)}</td>
              <td>{a.acquisition_date?.split("T")[0]}</td>
              <td>{a.location || "-"}</td>
              <td>{formatStatus(a.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CetakDaftarAset;
