import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/print.css";

function CetakRiwayatPenyusutan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, month, year } = location.state || {};
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "Unknown User";
  const printedAt = new Date().toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short"
  });


  const hasPrinted = useRef(false); 

  useEffect(() => {
    if (!data || data.length === 0 || hasPrinted.current) return;

    hasPrinted.current = true;

    setTimeout(() => {
      window.print();
      navigate("/penyusutan");
    }, 500);
  }, [data, navigate]);

  const formatCurrency = (val) => `Rp ${Number(val).toLocaleString("id-ID")}`;
  const formatDate = (val) => new Date(val).toISOString().split("T")[0];
  const formatMonth = (m) =>
  new Date(0, m - 1).toLocaleString("id-ID", { month: "long" });

  if (!data) return <div>Data tidak ditemukan.</div>;

  return (
    <div className="print-container">
      <div className="print-header">
        <h4>Laporan Penyusutan Aset</h4>
        <p>
            Bulan: {month ? formatMonth(month) : "Seluruh Catatan"} {year || ""}
        </p>
        <div className="print-meta">
            <p>Dicetak oleh: <strong>{username}</strong></p>
            <p>Waktu Cetak: {printedAt}</p>
        </div>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Kode Aset</th>
            <th>Nama Aset</th>
            <th>Tanggal</th>
            <th>Penyusutan</th>
            <th>Akumulasi</th>
            <th>Nilai Buku</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.asset_code}</td>
              <td>{item.asset_name}</td>
              <td>{formatDate(item.depreciation_date)}</td>
              <td>{formatCurrency(item.depreciation_amount)}</td>
              <td>{formatCurrency(item.accumulated_depreciation)}</td>
              <td>{formatCurrency(item.book_value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CetakRiwayatPenyusutan;