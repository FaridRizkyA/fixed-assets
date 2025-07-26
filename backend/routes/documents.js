const express = require("express");
const router = express.Router();
const db = require("../db");

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

module.exports = router;