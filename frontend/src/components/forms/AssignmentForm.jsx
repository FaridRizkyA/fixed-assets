import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

function AssignmentForm({ onAssigned }) {
  const [availableAssets, setAvailableAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    asset_id: "",
    assigned_to: "",
    department: "",
    assigned_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    fetchAssets();
    fetchUsers();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assets");
      const filtered = res.data.filter((item) => item.status === "available");
      setAvailableAssets(filtered);
    } catch (err) {
      console.error("Gagal mengambil aset:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal mengambil user:", err);
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const res = await axios.post("http://localhost:5000/api/assignments", form);

          if (res.status === 201) {
            alert("Penempatan aset berhasil.");
            setForm({
              asset_id: "",
              assigned_to: "",
              department: "",
              assigned_date: new Date().toISOString().split("T")[0],
              notes: "",
            });
            await fetchAssets();
            onAssigned();
          }
      } catch (err) {
          console.error("Gagal melakukan penempatan:", err);
          alert("Gagal melakukan penempatan aset.");
      }
    };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Aset</Form.Label>
            <Form.Select
              name="asset_id"
              value={form.asset_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Pilih Aset</option>
              {availableAssets.map((asset) => (
                <option key={asset.asset_id} value={asset.asset_id}>
                  {asset.asset_code} - {asset.asset_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Pengguna</Form.Label>
            <Form.Select
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Pilih Pengguna</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
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

        <Col md={4}>
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

        <Col md={8}>
          <Form.Group>
            <Form.Label>Catatan</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="text-end mt-3">
        <Button type="submit" variant="primary">
          Simpan Penempatan
        </Button>
      </div>
    </Form>
  );
}

export default AssignmentForm;