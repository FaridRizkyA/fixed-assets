import React, { useState } from "react";
import { Card } from "react-bootstrap";
import DepreciationsTable from "../components/tables/DepreciationsTable";
import DepreciationsHistoryTable from "../components/tables/DepreciationsHistoryTable";

function PenyusutanAset() {
  const [refreshTable, setRefreshTable] = useState(false);

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