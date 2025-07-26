import React from "react";
import { Modal, Table, Button, Badge } from "react-bootstrap";

function ActivateUserModal({ show, onClose, inactiveUsers, onRestore }) {
  const renderStatusBadge = (status) => {
    switch (status) {
      case "inactive":
        return <Badge bg="danger">Nonaktif</Badge>;
      case "active":
        return <Badge bg="success">Aktif</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Pengguna Nonaktif</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Pulihkan</th>
            </tr>
          </thead>
          <tbody>
            {inactiveUsers.map((u) => (
              <tr key={u.user_id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{renderStatusBadge(u.status)}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onRestore(u.user_id)}
                  >
                    Pulihkan
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default ActivateUserModal;