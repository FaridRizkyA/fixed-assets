import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

function EditAssetModal({ show, onHide, asset, onUpdated }) {
  const [form, setForm] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (asset) {
        setForm({
        asset_name: asset.asset_name || "",
        category_id: asset.category_id || "",
        acquisition_date: asset.acquisition_date?.split("T")[0] || "",
        acquisition_cost: asset.acquisition_cost || "",
        location: asset.location || "",
        conditions: asset.conditions || "",
        });
    }
    }, [asset]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("http://localhost:5000/api/assets/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Gagal mengambil kategori:", err);
      }
    }

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/assets/${asset.asset_id}`, form);

      if (res.status === 200) {
        alert("Aset berhasil diperbarui.");
        onUpdated();
        onHide();
      } else {
        throw new Error("Status bukan 200");
      }
    } catch (err) {
      console.error("Gagal memperbarui aset:", err);
      if (err?.response?.status !== 200) {
        alert("Terjadi kesalahan saat memperbarui aset.");
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Aset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nama Aset</Form.Label>
                <Form.Control
                  name="asset_name"
                  value={form.asset_name || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Kategori</Form.Label>
                <Form.Select
                  name="category_id"
                  value={form.category_id || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Harga Perolehan</Form.Label>
                <Form.Control
                  type="number"
                  name="acquisition_cost"
                  value={form.acquisition_cost || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tanggal Perolehan</Form.Label>
                <Form.Control
                  type="date"
                  name="acquisition_date"
                  value={form.acquisition_date ? form.acquisition_date.split("T")[0] : ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Lokasi</Form.Label>
                <Form.Control
                  name="location"
                  value={form.location || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Kondisi</Form.Label>
                <Form.Select
                    name="conditions"
                    value={form.conditions}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Pilih</option>
                    <option value="Baru">Baru</option>
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Batal
          </Button>
          <Button variant="primary" type="submit">
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditAssetModal;