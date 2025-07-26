const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/category-chart", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.category_name, COUNT(a.asset_id) AS total
      FROM asset_categories c
      LEFT JOIN assets a ON a.category_id = c.category_id
      GROUP BY c.category_id
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil data kategori aset:", err);
    res.status(500).json({ error: "Gagal mengambil data kategori aset" });
  }
});

router.get("/depreciation-chart", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(depreciation_date, '%Y-%m') AS month, 
       SUM(depreciation_amount) AS total
      FROM asset_depreciations
      WHERE depreciation_date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '%Y-%m-01')
      GROUP BY month
      ORDER BY month ASC
    `);

    // Buat array bulan 5 terakhir dari sekarang
    const now = new Date();
    const result = [];

    for (let i = 4; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const key = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0');

      const found = rows.find(r => r.month === key);
      result.push({ month: key, total: found ? Number(found.total) : 0 });
    }

    res.json(result);
  } catch (err) {
    console.error("Gagal mengambil data penyusutan bulanan:", err);
    res.status(500).json({ error: "Gagal mengambil data penyusutan bulanan" });
  }
});

router.get("/assets-value-chart", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT asset_name, acquisition_cost
      FROM assets
      ORDER BY acquisition_cost DESC
      LIMIT 3
    `);

    const data = rows.map(row => ({
      name: row.asset_name,
      value: parseFloat(row.acquisition_cost / 1000000).toFixed(2)  // Jutaan
    }));

    res.json(data);
  } catch (err) {
    console.error("Gagal mengambil data nilai aset:", err);
    res.status(500).json({ error: "Gagal mengambil data nilai aset" });
  }
});

router.get("/disposal-chart", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT disposal_type, COUNT(*) AS total
      FROM asset_disposals
      GROUP BY disposal_type
    `);

    const result = rows.map(r => ({
      type: r.disposal_type,
      total: Number(r.total)
    }));

    res.json(result);
  } catch (err) {
    console.error("Gagal mengambil data disposal:", err);
    res.status(500).json({ error: "Gagal mengambil data disposal" });
  }
});

module.exports = router;