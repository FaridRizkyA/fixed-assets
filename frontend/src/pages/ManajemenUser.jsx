import React, { useState } from "react";
import { Card } from "react-bootstrap";
import UsersTable from "../components/tables/UsersTable";

function ManajemenUser() {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
    if (role !== "admin") {
      return <div className="text-danger">Anda tidak memiliki akses ke halaman ini.</div>;
    }
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
