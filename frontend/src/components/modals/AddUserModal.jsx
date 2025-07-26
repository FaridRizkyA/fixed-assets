import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function AddUserModal({ show, onClose, onUserAdded }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      alert("Semua field wajib diisi.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Konfirmasi password tidak sesuai.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/users/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      alert("Pengguna berhasil ditambahkan.");
      onUserAdded();
      onClose();
      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    } catch (err) {
      console.error("Gagal menambahkan user:", err);
      alert("Gagal menambahkan user. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const roleList = [
    "admin",
    "asset_manager",
    "auditor",
    "finance",
    "staff",
  ];

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Pengguna Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Konfirmasi Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Pilih Role</option>
                  {roleList.map((role, idx) => (
                    <option key={idx} value={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddUserModal;