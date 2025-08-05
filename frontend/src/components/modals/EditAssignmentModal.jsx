import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

function EditAssignmentModal({ show, onHide, assignment, onUpdated }) {
  const [form, setForm] = useState({});
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (assignment) {
      setForm({
        ...assignment,
        assigned_date: assignment.assigned_date?.split("T")[0],
        return_date: assignment.return_date ? assignment.return_date.split("T")[0] : "",
      });
    }
  }, [assignment]);

  // Fetch data aset dan user
  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, assetRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_URL + "/api/users"),
          axios.get(import.meta.env.VITE_API_URL + "/api/assets"),
        ]);

        setUsers(userRes.data);

        // Ambil hanya aset dengan status 'available' atau yang sedang digunakan oleh assignment ini
        const allAssets = assetRes.data;
        const filtered = allAssets.filter(a =>
          a.status === "available" || a.asset_id === assignment?.asset_id
        );

        filtered.sort((a, b) => a.asset_code.localeCompare(b.asset_code));

        setAssets(filtered);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    }

    if (assignment) {
      fetchData();
    }
  }, [assignment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const departmentList = [
    "Operasional",
    "Gudang",
    "Keuangan",
    "IT",
    "Sumber Daya Manusia",
    "Logistik",
    "Manajemen"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(import.meta.env.VITE_API_URL + `/api/assignments/${assignment.assignment_id}`, form);

      if (res.status === 200) {
        alert("Penempatan berhasil diperbarui.");
        onUpdated();
        onHide();
      }
    } catch (err) {
      console.error("Gagal memperbarui penempatan:", err);
      alert("Terjadi kesalahan saat memperbarui penempatan.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Penempatan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Aset</Form.Label>
                <Form.Select name="asset_id" value={form.asset_id} onChange={handleChange} required>
                  <option value="">Pilih</option>
                  {assets.map((a) => (
                    <option key={a.asset_id} value={a.asset_id}>
                      {a.asset_code} - {a.asset_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Penanggung Jawab</Form.Label>
                <Form.Select name="assigned_to" value={form.assigned_to} onChange={handleChange} required>
                  <option value="">Pilih</option>
                  {users.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.username}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Departemen</Form.Label>
                <Form.Select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Pilih Departemen</option>
                  {departmentList.map((dept, idx) => (
                    <option key={idx} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Tanggal Penempatan</Form.Label>
                <Form.Control
                  type="date"
                  name="assigned_date"
                  value={form.assigned_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            {assignment?.return_date && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tanggal Kembali</Form.Label>
                  <Form.Control
                    type="date"
                    name="return_date"
                    value={form.return_date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            )}

            <Col md={12}>
              <Form.Group>
                <Form.Label>Catatan</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="notes"
                  value={form.notes || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditAssignmentModal;