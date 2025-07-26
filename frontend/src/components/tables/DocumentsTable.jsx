import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";

function DocumentsTable() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Gagal mengambil data dokumen:", err);
    }
  };

  const getLabel = (type) => {
    switch (type) {
      case "invoice": return "Faktur";
      case "certificate": return "Sertifikat";
      case "photo": return "Foto";
      case "other": return "Lainnya";
      default: return type;
    }
  };

  const handleView = (path) => {
    const url = `http://localhost:5000${path}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <h5 className="mb-3">Dokumen Aset</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nama Aset</th>
            <th>Jenis Dokumen</th>
            <th>Diunggah Oleh</th>
            <th>Tanggal Upload</th>
            <th>Lihat</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.document_id}>
              <td>{doc.asset_name}</td>
              <td>{getLabel(doc.document_type)}</td>
              <td>{doc.username}</td>
              <td>{new Date(doc.uploaded_at).toLocaleString()}</td>
              <td>
                <Button
                as="a"
                href={`http://localhost:5000${doc.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="info"
                size="sm"
                >
                Lihat File
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default DocumentsTable;
