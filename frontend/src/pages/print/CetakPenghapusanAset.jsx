import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/print.css";

function CetakPenghapusanAset() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data, printedBy, printedAt } = state || {};

  useEffect(() => {
    const timer = setTimeout(() => window.print(), 300);
    window.addEventListener("afterprint", () => navigate("/penghapusan"));
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
        <h4>Laporan Penghapusan Aset</h4>
        <p>Dicetak oleh: <strong>{printedBy}</strong></p>
        <p>Tanggal Cetak: {printedAt}</p>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Kode Aset</th>
            <th>Nama Aset</th>
            <th>Tanggal Penghapusan</th>
            <th>Jenis Penghapusan</th>
            <th>Nilai Penghapusan</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{a.asset_code}</td>
              <td>{a.asset_name}</td>
              <td>{formatDate(a.disposal_date)}</td>
              <td>{a.disposal_type}</td>
              <td>{a.disposal_value ? `Rp ${Number(a.disposal_value).toLocaleString("id-ID")}` : "-"}</td>
              <td>{a.notes ? a.notes : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CetakPenghapusanAset;
