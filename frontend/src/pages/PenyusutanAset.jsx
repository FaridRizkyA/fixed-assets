import React, { useState } from "react";
import { Card } from "react-bootstrap";
import DepreciationsTable from "../components/tables/DepreciationsTable";
import DepreciationsHistoryTable from "../components/tables/DepreciationsHistoryTable";

function PenyusutanAset() {
  const [refreshTable, setRefreshTable] = useState(false);

  const role = JSON.parse(localStorage.getItem("user"))?.role;
  if (role === "staff") {
    return <div className="text-danger">Anda tidak memiliki akses ke halaman ini.</div>;
  }

  const handleRefresh = () => {
    setRefreshTable(prev => !prev);
  };

  return (
    <>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <DepreciationsTable refreshTrigger={refreshTable} />
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <DepreciationsHistoryTable refreshTrigger={refreshTable} />
        </Card.Body>
      </Card>
    </>
  );
}

export default PenyusutanAset;