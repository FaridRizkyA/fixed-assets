import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/print.css";

function CetakPenempatanAset() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data, printedBy, printedAt } = state || {};

  useEffect(() => {
    const timer = setTimeout(() => window.print(), 300);
    window.addEventListener("afterprint", () => navigate("/penempatan"));
    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", () => {});
    };
  }, []);

  const formatDate = (val) => val ? new Date(val).toLocaleDateString("id-ID") : "-";

  if (!data) return <div>Data tidak tersedia.</div>;

  return (
    <div className="print-container">
      <div className="print-header">
        <h4>Laporan Penempatan Aset</h4>
        <p>Dicetak oleh: <strong>{printedBy}</strong></p>
        <p>Tanggal Cetak: {printedAt}</p>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama Aset</th>
            <th>Kode Aset</th>
            <th>Ditugaskan Kepada</th>
            <th>Departemen</th>
            <th>Tanggal Penempatan</th>
            <th>Tanggal Pengembalian</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{a.asset_name}</td>
              <td>{a.asset_code}</td>
              <td>{a.assigned_user || "-"}</td>
              <td>{a.department || "-"}</td>
              <td>{formatDate(a.assigned_date)}</td>
              <td>{a.return_date ? formatDate(a.return_date) : "Masih Digunakan"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CetakPenempatanAset;