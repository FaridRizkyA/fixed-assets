import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import EditDocumentModal from "../modals/EditDocumentModal";

function DocumentsTable() {
  const [documents, setDocuments] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/documents");
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
    const url = import.meta.env.VITE_API_URL + `${path}`;
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
            <th>Aksi</th>
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
                <div className="d-flex gap-1 flex-wrap">
                  {["admin", "asset_manager"].includes(role) && (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowEdit(true);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleView(doc.file_path)}
                  >
                    Lihat File
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedDoc && (
        <EditDocumentModal
          show={showEdit}
          onHide={() => setShowEdit(false)}
          document={selectedDoc}
          onUpdated={fetchDocuments}
        />
      )}

    </>
  );
}

export default DocumentsTable;
