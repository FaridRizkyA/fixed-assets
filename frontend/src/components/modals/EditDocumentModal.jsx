import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function EditDocumentModal({ show, onHide, document, onUpdated }) {
  const [type, setType] = useState(document?.document_type || "");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !file) {
      alert("Tipe dan file wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("document_type", type);
    formData.append("file", file);

    try {
      await axios.put(`http://localhost:5000/api/documents/${document.document_id}`, formData);
      alert("Dokumen berhasil diperbarui.");
      onUpdated();
      onHide();
    } catch (err) {
      console.error("Gagal update dokumen:", err);
      alert("Gagal memperbarui dokumen.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Dokumen Aset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tipe Dokumen</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="" disabled>Pilih tipe</option>
              <option value="invoice">Faktur</option>
              <option value="certificate">Sertifikat</option>
              <option value="photo">Foto</option>
              <option value="other">Lainnya</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>File Baru</Form.Label>
            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Batal</Button>
          <Button variant="primary" type="submit">Simpan</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditDocumentModal;