import React, { useState } from "react";
import { Card } from "react-bootstrap";
import DocumentsTable from "../components/tables/DocumentsTable";

function DokumenAset() {
  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <DocumentsTable />
        </Card.Body>
      </Card>
    </>
  );
}

export default DokumenAset;
