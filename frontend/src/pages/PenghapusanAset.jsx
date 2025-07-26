import React, { useState } from "react";
import { Card } from "react-bootstrap";
import DisposalForm from "../components/forms/DisposalForm";
import DisposalsTable from "../components/tables/DisposalsTable";

function PenghapusanAset() {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
    if (role !== "admin" || role !== "asset_manager") {
      return <div className="text-danger">Anda tidak memiliki akses ke halaman ini.</div>;
    }

  const [refreshTable, setRefreshTable] = useState(false);

  const handleDisposalAdded = () => {
    setRefreshTable((prev) => !prev);
  };

  return (
    <>
      {(role === "admin" || role === "asset_manager") && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">Penghapusan Aset</h5>
            <DisposalForm onDisposalSubmitted={handleDisposalAdded} />
          </Card.Body>
        </Card>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <DisposalsTable refreshTrigger={refreshTable} />
        </Card.Body>
      </Card>
    </>
  );
}

export default PenghapusanAset;