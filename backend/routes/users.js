const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT user_id, username, email, role, status
      FROM users
      WHERE status = 'active'
      ORDER BY user_id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil user:", err);
    res.status(500).json({ error: "Gagal mengambil user" });
  }
});

router.get("/inactive", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT user_id, username, email, role, status
      FROM users
      WHERE status = 'inactive'
      ORDER BY user_id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil user nonaktif:", err);
    res.status(500).json({ error: "Gagal mengambil user nonaktif" });
  }
});

router.patch("/deactivate/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`
      UPDATE users SET status = 'inactive' WHERE user_id = ?
    `, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Gagal nonaktifkan user:", err);
    res.status(500).json({ error: "Gagal nonaktifkan user" });
  }
});

router.patch("/restore/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`
      UPDATE users SET status = 'active' WHERE user_id = ?
    `, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Gagal memulihkan user:", err);
    res.status(500).json({ error: "Gagal memulihkan user" });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "Semua field wajib diisi." });
  }

  try {
    // Cek apakah username atau email sudah digunakan
    const [existing] = await db.query(
      `SELECT * FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Username atau email sudah digunakan." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    await db.query(
      `INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, 'inactive')`,
      [username, email, hashedPassword, role]
    );

    res.json({ success: true, message: "User berhasil didaftarkan." });
  } catch (err) {
    console.error("Gagal registrasi user:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat registrasi." });
  }
});

const bcrypt = require("bcrypt");

// Ganti password
router.patch("/password/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password dibutuhkan" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      `UPDATE users SET password = ? WHERE user_id = ?`,
      [hashed, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Gagal update password:", err);
    res.status(500).json({ error: "Gagal update password" });
  }
});

module.exports = router;