import React, { useState } from "react";
import { Card } from "react-bootstrap";
import UsersTable from "../components/tables/UsersTable";

function ManajemenUser() {
  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <UsersTable />
        </Card.Body>
      </Card>
    </>
  );
}

export default ManajemenUser;
