const express = require("express");
const router = express.Router();
const db = require("../db");

// Ambil semua penempatan aset
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT aa.*, a.asset_code, a.asset_name, u.username AS assigned_user
      FROM asset_assignments aa
      JOIN assets a ON aa.asset_id = a.asset_id
      JOIN users u ON aa.assigned_to = u.user_id
      ORDER BY aa.assignment_id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil riwayat penempatan:", err);
    res.status(500).json({ error: "Gagal mengambil data penempatan" });
  }
});

// Tambah penempatan aset
router.post("/", async (req, res) => {
  const { asset_id, assigned_to, department, assigned_date, notes } = req.body;

  if (!asset_id || !assigned_to || !assigned_date) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  try {
    // Insert ke tabel penempatan
    await db.query(`
      INSERT INTO asset_assignments (asset_id, assigned_to, department, assigned_date, notes)
      VALUES (?, ?, ?, ?, ?)`,
      [asset_id, assigned_to, department, assigned_date, notes]
    );

    // Update status aset menjadi in_use
    await db.query(`UPDATE assets SET status = 'in_use' WHERE asset_id = ?`, [asset_id]);

    res.status(201).json({ message: "Penempatan aset berhasil" });
  } catch (err) {
    console.error("Gagal menambahkan penempatan:", err);
    res.status(500).json({ error: "Gagal menambahkan penempatan aset" });
  }
});

// Kembalikan aset (ubah return_date dan status aset)
router.put("/return/:assignment_id", async (req, res) => {
  const { assignment_id } = req.params;

  try {
    // Ambil asset_id dari assignment
    const [rows] = await db.query(`
      SELECT asset_id FROM asset_assignments WHERE assignment_id = ?`, [assignment_id]);

    if (rows.length === 0) return res.status(404).json({ error: "Data penempatan tidak ditemukan" });

    const assetId = rows[0].asset_id;

    // Set return_date ke hari ini
    await db.query(`
      UPDATE asset_assignments SET return_date = CURDATE() WHERE assignment_id = ?`, [assignment_id]);

    // Update status aset ke available
    await db.query(`UPDATE assets SET status = 'available' WHERE asset_id = ?`, [assetId]);

    res.json({ message: "Aset berhasil dikembalikan" });
  } catch (err) {
    console.error("Gagal mengembalikan aset:", err);
    res.status(500).json({ error: "Gagal mengembalikan aset" });
  }
});

// Hapus penempatan aset
router.delete("/:assignment_id", async (req, res) => {
  const { assignment_id } = req.params;

  try {
    // Ambil asset_id dan return_date
    const [rows] = await db.query(`
      SELECT asset_id, return_date FROM asset_assignments WHERE assignment_id = ?
    `, [assignment_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Penempatan tidak ditemukan" });
    }

    const { asset_id, return_date } = rows[0];

    // Jika aset belum dikembalikan, ubah status ke 'available'
    if (!return_date) {
      await db.query(`
        UPDATE assets SET status = 'available' WHERE asset_id = ?
      `, [asset_id]);
    }

    // Hapus assignment
    await db.query(`
      DELETE FROM asset_assignments WHERE assignment_id = ?
    `, [assignment_id]);

    res.json({ message: "Penempatan berhasil dihapus" });
  } catch (err) {
    console.error("Gagal menghapus penempatan:", err);
    res.status(500).json({ error: "Gagal menghapus penempatan aset" });
  }
});

// Update penempatan aset
router.put("/:assignment_id", async (req, res) => {
  const { assignment_id } = req.params;
  const { asset_id, assigned_to, department, assigned_date, return_date, notes } = req.body;

  try {
    // Ambil data lama
    const [rows] = await db.query("SELECT return_date FROM asset_assignments WHERE assignment_id = ?", [assignment_id]);
    if (rows.length === 0) return res.status(404).json({ error: "Penempatan tidak ditemukan" });

    const currentReturnDate = rows[0].return_date;

    // Jika return_date belum pernah diisi, abaikan nilai yang dikirim
    const updatedReturnDate = currentReturnDate ? return_date : null;

    await db.query(`
      UPDATE asset_assignments
      SET asset_id = ?, assigned_to = ?, department = ?, assigned_date = ?, return_date = ?, notes = ?
      WHERE assignment_id = ?`,
      [asset_id, assigned_to, department, assigned_date, updatedReturnDate, notes, assignment_id]
    );

    res.json({ message: "Penempatan berhasil diperbarui" });
  } catch (err) {
    console.error("Gagal memperbarui penempatan:", err);
    res.status(500).json({ error: "Gagal memperbarui penempatan aset" });
  }
});

module.exports = router;