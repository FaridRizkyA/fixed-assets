import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

function AssetForm({ onAssetAdded }) {
  const fileRefs = useRef([]);
  const [categories, setCategories] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState([
    {
      asset_name: "",
      category_id: "",
      acquisition_date: today,
      acquisition_cost: "",
      location: "",
      conditions: "",
      status: "available",
      document_type: "",
      document_file: null,
    },
  ]);

  const locationList = [
    "Gudang Bandung",
    "Gudang Jakarta",
    "Gudang Medan",
    "Gudang Surabaya",
    "Kantor Pusat",
    "Pelabuhan Belawan"
  ];

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

  const handleInputChange = (index, e) => {
    const { name, value, files } = e.target;
    const updated = [...form];

    if (name === "document_file") {
      updated[index][name] = files[0];
    } else {
      updated[index][name] = value;
    }

    setForm(updated);
  };

  const handleAddItem = () => {
    setForm([
      ...form,
      {
        asset_name: "",
        category_id: "",
        acquisition_date: today,
        acquisition_cost: "",
        location: "",
        conditions: "",
        status: "available",
        document_type: "",
        document_file: null,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const updated = [...form];
    updated.splice(index, 1);
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const createdBy = user?.user_id;
      if (!createdBy) throw new Error("User ID tidak ditemukan di localStorage");

      const formData = new FormData();

      form.forEach((item, index) => {
        formData.append("assets", JSON.stringify({
          asset_name: item.asset_name,
          category_id: item.category_id,
          acquisition_date: item.acquisition_date,
          acquisition_cost: item.acquisition_cost,
          location: item.location,
          conditions: item.conditions,
          status: item.status,
          created_by: createdBy,
          document_type: item.document_type || "",
        }));

        if (item.document_file) {
          formData.append("documents", item.document_file);
        } else {
          formData.append("documents", null);
        }

        fileRefs.current.forEach((ref) => {
          if (ref) ref.value = null;
        }); 
        
      });

      await axios.post("http://localhost:5000/api/assets/batch", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Data aset berhasil ditambahkan!");
      onAssetAdded();

      setForm([
        {
          asset_name: "",
          category_id: "",
          acquisition_date: today,
          acquisition_cost: "",
          location: "",
          conditions: "",
          status: "available",
          document_type: "",
          document_file: null,
        },
      ]);
    } catch (err) {
      console.error("Gagal menambahkan aset:", err);
      alert("Terjadi kesalahan saat menambahkan aset.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {form.map((item, index) => (
        <div key={index} className="border rounded p-3 mb-3 bg-light">
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Nama Aset</Form.Label>
                <Form.Control
                  name="asset_name"
                  value={item.asset_name}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Kategori</Form.Label>
                <Form.Select
                  name="category_id"
                  value={item.category_id}
                  onChange={(e) => handleInputChange(index, e)}
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
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tanggal Perolehan</Form.Label>
                <Form.Control
                  type="date"
                  name="acquisition_date"
                  value={item.acquisition_date}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Harga Perolehan</Form.Label>
                <Form.Control
                  type="number"
                  name="acquisition_cost"
                  value={item.acquisition_cost}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Lokasi</Form.Label>
                <Form.Select
                  name="location"
                  value={item.location}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                >
                  <option value="" disabled>Pilih Lokasi</option>
                  {locationList.map((loc, idx) => (
                    <option key={idx} value={loc}>
                      {loc}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Kondisi</Form.Label>
                <Form.Select
                  name="conditions"
                  value={item.conditions}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                >
                  <option value="" disabled>Pilih Kondisi</option>
                  <option value="Baru">Baru</option>
                  <option value="Baik">Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Jenis Dokumen</Form.Label>
                <Form.Select
                  name="document_type"
                  value={item.document_type}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                >
                  <option value="" disabled>-- Pilih Jenis Dokumen --</option>
                  <option value="invoice">Faktur</option>
                  <option value="certificate">Sertifikat</option>
                  <option value="photo">Foto</option>
                  <option value="other">Lainnya</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Dokumen</Form.Label>
                  <Form.Control
                    type="file"
                    name="document_file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    ref={(el) => (fileRefs.current[index] = el)}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
              </Form.Group>
            </Col>
          </Row>

          {form.length > 1 && (
            <div className="text-end mt-2">
              <Button variant="outline-danger" size="sm" onClick={() => handleRemoveItem(index)}>
                Hapus
              </Button>
            </div>
          )}
        </div>
      ))}

      <div className="d-flex justify-content-between">
        <Button variant="secondary" type="button" onClick={handleAddItem}>
          + Tambah Baris
        </Button>
        <Button type="submit" variant="primary">
          Simpan Aset
        </Button>
      </div>
    </Form>
  );
}

export default AssetForm;