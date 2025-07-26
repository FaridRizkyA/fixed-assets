const express = require("express");
const router = express.Router();
const db = require("../db");
const upload = require("../middleware/upload");
const path = require("path");
const fs = require("fs");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.document_id,
        d.asset_id,
        a.asset_name,
        d.document_type,
        d.file_path,
        d.uploaded_at,
        u.username
      FROM asset_documents d
      JOIN assets a ON d.asset_id = a.asset_id
      JOIN users u ON d.uploaded_by = u.user_id
      ORDER BY d.uploaded_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil data dokumen aset:", err);
    res.status(500).json({ error: "Gagal mengambil data dokumen aset" });
  }
});

router.put("/:id", upload.single("file"), async (req, res) => {
  const { id } = req.params;
  const { document_type } = req.body;
  const file = req.file;

  if (!document_type || !file) {
    return res.status(400).json({ error: "Tipe dokumen dan file wajib diisi" });
  }

  try {
    // 1. Ambil data lama
    const [[oldDoc]] = await db.query(
      `SELECT file_path, document_type FROM asset_documents WHERE document_id = ?`,
      [id]
    );

    if (!oldDoc) return res.status(404).json({ error: "Dokumen tidak ditemukan" });

    // 2. Hapus file lama
    const oldPath = path.join(__dirname, "..", "uploads", oldDoc.document_type, path.basename(oldDoc.file_path));
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    // 3. Pindahkan file baru ke folder tujuan
    const newFolder = path.join(__dirname, "..", "uploads", document_type);
    if (!fs.existsSync(newFolder)) fs.mkdirSync(newFolder, { recursive: true });

    const newFilename = file.filename;
    const newPath = path.join(newFolder, newFilename);
    fs.renameSync(file.path, newPath);

    // 4. Update record
    const newDbPath = `/uploads/${document_type}/${newFilename}`;
    await db.query(
      `UPDATE asset_documents SET document_type = ?, file_path = ?, uploaded_at = NOW() WHERE document_id = ?`,
      [document_type, newDbPath, id]
    );

    res.json({ message: "Dokumen berhasil diperbarui" });
  } catch (err) {
    console.error("Gagal memperbarui dokumen:", err);
    res.status(500).json({ error: "Gagal memperbarui dokumen" });
  }
});

module.exports = router;