import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function EditUserModal({ show, onClose, user, onUpdated }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (user) {
      setPassword("");
      setConfirm("");
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!password || password !== confirm) {
      alert("Password tidak cocok atau kosong");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/users/password/${user.user_id}`, {
        password,
      });
      alert("Password berhasil diperbarui.");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Gagal memperbarui password:", err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Pengguna</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={user?.username || ""} disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password Baru</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password baru"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Konfirmasi Password</Form.Label>
            <Form.Control
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditUserModal;