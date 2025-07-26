const express = require("express");
const router = express.Router();
const db = require("../db");

// Ambil daftar penghapusan aset
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, a.asset_code, a.asset_name, c.category_name
      FROM asset_disposals d
      JOIN assets a ON d.asset_id = a.asset_id
      LEFT JOIN asset_categories c ON a.category_id = c.category_id
      ORDER BY d.disposal_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil data disposal:", err);
    res.status(500).json({ error: "Gagal mengambil data disposal" });
  }
});

// Tambah penghapusan aset
router.post("/", async (req, res) => {
  const { asset_id, disposal_date, disposal_type, disposal_value, notes, created_by } = req.body;

  try {
    // 1. Cek status aset
    const [[asset]] = await db.query(`SELECT status FROM assets WHERE asset_id = ?`, [asset_id]);

    if (!asset) return res.status(404).json({ error: "Aset tidak ditemukan" });

    // 2. Jika aset masih in_use, update return_date pada assignment
    if (asset.status === "in_use") {
      await db.query(`
        UPDATE asset_assignments
        SET return_date = CURDATE()
        WHERE asset_id = ? AND return_date IS NULL
        ORDER BY assigned_date DESC
        LIMIT 1
      `, [asset_id]);
    }

    // 3. Tambahkan ke disposal
    await db.query(`
      INSERT INTO asset_disposals (asset_id, disposal_date, disposal_type, disposal_value, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [asset_id, disposal_date, disposal_type, disposal_value || 0, notes, created_by]);

    // 4. Update status aset menjadi disposal
    await db.query(`UPDATE assets SET status = 'disposal' WHERE asset_id = ?`, [asset_id]);

    res.status(201).json({ message: "Aset berhasil dihapus (disposal)" });
  } catch (err) {
    console.error("Gagal menghapus aset:", err);
    res.status(500).json({ error: "Gagal menambah disposal" });
  }
});

// Pulihkan aset (hapus record disposal + ubah status aset)
router.delete("/:disposal_id", async (req, res) => {
  const { disposal_id } = req.params;

  try {
    // Ambil asset_id dari disposal yang ingin dihapus
    const [rows] = await db.query(
      `SELECT asset_id FROM asset_disposals WHERE disposal_id = ?`,
      [disposal_id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Disposal tidak ditemukan" });

    const assetId = rows[0].asset_id;

    // Hapus dari tabel disposal
    await db.query(`DELETE FROM asset_disposals WHERE disposal_id = ?`, [disposal_id]);

    // Ubah status aset kembali ke available
    await db.query(`UPDATE assets SET status = 'available' WHERE asset_id = ?`, [assetId]);

    res.json({ message: "Aset berhasil dipulihkan" });
  } catch (err) {
    console.error("Gagal memulihkan aset:", err);
    res.status(500).json({ error: "Gagal memulihkan aset" });
  }
});

router.put("/:disposal_id", async (req, res) => {
  const { disposal_id } = req.params;
  const { disposal_date, disposal_type, disposal_value, notes } = req.body;

  try {
    await db.query(`
      UPDATE asset_disposals
      SET disposal_date = ?, 
          disposal_type = ?, 
          disposal_value = ?, 
          notes = ?
      WHERE disposal_id = ?
    `, [disposal_date, disposal_type, disposal_value || 0, notes, disposal_id]);

    res.json({ message: "Data penghapusan aset berhasil diperbarui" });
  } catch (err) {
    console.error("Gagal mengupdate disposal:", err);
    res.status(500).json({ error: "Gagal mengupdate data penghapusan aset" });
  }
});

module.exports = router;
