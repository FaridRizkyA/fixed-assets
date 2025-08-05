import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

function DisposalForm({ onDisposalSubmitted }) {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    asset_id: "",
    disposal_date: new Date().toISOString().split("T")[0],
    disposal_type: "",
    disposal_value: "",
    notes: ""
  });

  useEffect(() => {
    fetchAvailableAssets();
  }, []);

  const fetchAvailableAssets = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/assets");
      setAssets(res.data.filter(item => item.status !== "disposal"));
    } catch (err) {
      console.error("Gagal mengambil aset:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const created_by = user?.user_id;

      if (!form.asset_id || !form.disposal_date || !form.disposal_type) {
        alert("Harap lengkapi semua kolom wajib.");
        return;
      }

      const payload = {
        ...form,
        disposal_value: form.disposal_type === "sale" ? form.disposal_value : 0,
        created_by,
      };

      const res = await axios.post(import.meta.env.VITE_API_URL + "/api/disposals", payload);

      if (res.status === 201) {
        alert("Penghapusan aset berhasil.");
        setForm({
          asset_id: "",
          disposal_date: new Date().toISOString().split("T")[0],
          disposal_type: "",
          disposal_value: "",
          notes: "",
        });
        await fetchAvailableAssets();
        onDisposalSubmitted();
      }
    } catch (err) {
      console.error("Gagal menambahkan disposal:", err);
      alert("Gagal menambahkan penghapusan aset.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row className="g-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Pilih Aset</Form.Label>
            <Form.Select name="asset_id" value={form.asset_id} onChange={handleChange} required>
              <option value="" disabled>Pilih Aset</option>
              {assets.map((asset) => (
                <option key={asset.asset_id} value={asset.asset_id}>
                  {asset.asset_code} - {asset.asset_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
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
        <Col md={4}>
          <Form.Group>
            <Form.Label>Jenis Penghapusan</Form.Label>
            <Form.Select name="disposal_type" value={form.disposal_type} onChange={handleChange} required>
              <option value="" disabled>Pilih Jenis Penghapusan</option>
              <option value="sale">Dijual</option>
              <option value="lost">Hilang</option>
              <option value="damaged">Rusak</option>
            </Form.Select>
          </Form.Group>
        </Col>
        {form.disposal_type === "sale" && (
          <Col md={4}>
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
        <Col md={8}>
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
      <div className="mt-3 text-end">
        <Button type="submit" variant="danger">
          Hapus Aset
        </Button>
      </div>
    </Form>
  );
}

export default DisposalForm;