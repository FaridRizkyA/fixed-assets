import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

function EditDisposalModal({ show, onHide, data, onUpdated }) {
  const [form, setForm] = useState({
    disposal_date: "",
    disposal_type: "",
    disposal_value: 0,
    notes: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        disposal_date: data.disposal_date?.split("T")[0] || "",
        disposal_type: data.disposal_type || "",
        disposal_value: data.disposal_value || 0,
        notes: data.notes || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/disposals/${data.disposal_id}`, form);
      alert("Data penghapusan berhasil diperbarui.");
      onUpdated();
      onHide();
    } catch (err) {
      console.error("Gagal update disposal:", err);
      alert("Gagal memperbarui data.");
    }
  };

  if (!data) return null;

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Penghapusan Aset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Nama Aset</Form.Label>
                <Form.Control value={data.asset_name} disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tanggal Penghapusan</Form.Label>
                <Form.Control
                  type="date"
                  name="disposal_date"
                  value={form.disposal_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Jenis Penghapusan</Form.Label>
                <Form.Select
                  name="disposal_type"
                  value={form.disposal_type}
                  onChange={handleChange}
                  required
                >
                  <option value="sale">Dijual</option>
                  <option value="lost">Hilang</option>
                  <option value="damaged">Rusak</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {form.disposal_type === "sale" && (
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Nilai Penjualan</Form.Label>
                  <Form.Control
                    type="number"
                    name="disposal_value"
                    value={form.disposal_value}
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
                  value={form.notes}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Batal</Button>
        <Button variant="primary" onClick={handleSubmit}>Simpan Perubahan</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditDisposalModal;