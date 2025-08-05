import React, { useState } from "react";
import { Card } from "react-bootstrap";
import AssignmentForm from "../components/forms/AssignmentForm";
import AssignmentsTable from "../components/tables/AssignmentsTable";

function PenempatanAset() {
  const [refreshTable, setRefreshTable] = useState(false);
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  const handleAssigned = () => {
    setRefreshTable((prev) => !prev);
  };

  return (
    <>
      {(role === "admin" || role === "asset_manager") && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">Tempatkan Aset</h5>
            <AssignmentForm onAssigned={handleAssigned} />
          </Card.Body>
        </Card>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <AssignmentsTable refreshTrigger={refreshTable} />
        </Card.Body>
      </Card>
    </>
  );
}

export default PenempatanAset;