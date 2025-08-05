import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Badge } from "react-bootstrap";
import axios from "axios";
import ActivateUserModal from "../modals/ActivateUserModal";
import AddUserModal from "../modals/AddUserModal";
import EditUserModal from "../modals/EditUserModal";

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.user_id;
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users"),
        axios.get("http://localhost:5000/api/users/inactive"),
      ]);
      setUsers(activeRes.data);
      setInactiveUsers(inactiveRes.data);
    } catch (err) {
      console.error("Gagal mengambil data pengguna:", err);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge bg="success">Aktif</Badge>;
      case "inactive":
        return <Badge bg="danger">Nonaktif</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm("Nonaktifkan pengguna ini?")) return;

    try {
      await axios.patch(import.meta.env.VITE_API_URL + `/api/users/deactivate/${userId}`);
      alert("Pengguna berhasil dinonaktifkan.");
      fetchUsers();
    } catch (err) {
      console.error("Gagal menonaktifkan pengguna:", err);
    }
  };

  const handleRestore = async (userId) => {
    if (!window.confirm("Pulihkan pengguna ini?")) return;

    try {
      await axios.patch(import.meta.env.VITE_API_URL + `/api/users/restore/${userId}`);
      alert("Pengguna berhasil dipulihkan.");
      fetchUsers();
    } catch (err) {
      console.error("Gagal memulihkan pengguna:", err);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Manajemen Pengguna</h5>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Tambah Pengguna
          </Button>
          <Button variant="secondary" onClick={() => setShowInactiveModal(true)}>
            Lihat Pengguna Nonaktif
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th colSpan={2}>Aksi</th>
          </tr>
        </thead>
        <tbody>
            {users.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{renderStatusBadge(u.status)}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEditClick(u)}
                    >
                      Edit
                    </Button>
                    </td>
                    <td>
                    {u.role !== "admin" && u.user_id !== currentUserId ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeactivate(u.user_id)}
                        className="me-2"
                      >
                        Nonaktifkan
                      </Button>
                    ) : (
                      <span className="text-muted">Tidak dapat dinonaktifkan</span>
                      )
                    }                  
                  </td>
                </tr>
            ))}
        </tbody>
      </Table>

      <ActivateUserModal
        show={showInactiveModal}
        onClose={() => setShowInactiveModal(false)}
        inactiveUsers={inactiveUsers}
        onRestore={handleRestore}
      />

      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={fetchUsers}
      />

      <EditUserModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={selectedUser}
        onUpdated={fetchUsers}
      />

    </>
  );
}

export default UsersTable;