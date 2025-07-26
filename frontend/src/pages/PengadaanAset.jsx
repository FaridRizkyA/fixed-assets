import React, { useState } from "react";
import { Card } from "react-bootstrap";
import AssetForm from "../components/forms/AssetForm";
import AssetsTable from "../components/tables/AssetsTable";

function PengadaanAset() {
  const [refreshTable, setRefreshTable] = useState(false);
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  const handleAssetAdded = () => {
    setRefreshTable(prev => !prev);
  };

  return (
    <>
      {(role === "admin" || role === "asset_manager") && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">Tambah Aset Baru</h5>
            <AssetForm onAssetAdded={handleAssetAdded} />
          </Card.Body>
        </Card>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <AssetsTable refreshTrigger={refreshTable} onAssetEdit={handleAssetAdded} />
        </Card.Body>
      </Card>
    </>
  );
}

export default PengadaanAset;