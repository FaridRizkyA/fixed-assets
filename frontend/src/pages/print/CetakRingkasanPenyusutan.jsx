import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/print.css";

function CetakRingkasanPenyusutan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  useEffect(() => {
    if (!data || data.length === 0) return;

    let printed = false;

    const timer = setTimeout(() => {
      if (!printed) {
        printed = true;
        window.print();
      }
    }, 300);

    const unlisten = () => {
      clearTimeout(timer);
    };

    window.addEventListener("afterprint", () => {
      navigate("/penyusutan");
    });

    return () => {
      unlisten();
      window.removeEventListener("afterprint", () => {});
    };
  }, []);

  const formatCurrency = (val) => {
    const num = Number(val);
    return !isNaN(num)
      ? `Rp ${num.toLocaleString("id-ID")}`
      : "Rp 0";
  };
    
  const formatDateTime = () => {
    const now = new Date();
    return now.toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  if (!data || data.length === 0) {
    return <div>Data tidak tersedia untuk dicetak.</div>;
  }

  return (
    <div className="print-container">
      <div className="print-header">
        <h4>Laporan Ringkasan Penyusutan Aset</h4>
        <p>Dicetak oleh: <strong>{location.state?.printedBy || "Pengguna"}</strong></p>
        <p>Tanggal Cetak: {formatDateTime()}</p>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Kode Aset</th>
            <th>Nama Aset</th>
            <th>Kategori</th>
            <th>Harga Perolehan</th>
            <th>Akumulasi Penyusutan</th>
            <th>Nilai Buku</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => {
            console.log(item);
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.asset_code}</td>
                <td>{item.asset_name}</td>
                <td>{item.category_name || "-"}</td>
                <td>{formatCurrency(item.acquisition_cost)}</td>
                <td>{formatCurrency(item.accumulated_depreciation)}</td>
                <td>{formatCurrency(item.book_value)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CetakRingkasanPenyusutan;
