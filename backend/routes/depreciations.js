const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/summary", async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
            a.asset_id,
            a.asset_code,
            a.asset_name,
            c.category_name,
            a.acquisition_cost,
            d.accumulated_depreciation,
            d.book_value
        FROM assets a
        JOIN asset_categories c ON a.category_id = c.category_id
        LEFT JOIN asset_depreciations d ON d.depreciation_id = (
            SELECT depreciation_id
            FROM asset_depreciations
            WHERE asset_id = a.asset_id
            ORDER BY depreciation_date DESC
            LIMIT 1
        )
        WHERE a.status != 'disposal'
        ORDER BY a.asset_code ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil ringkasan penyusutan:", err);
    res.status(500).json({ error: "Gagal mengambil ringkasan penyusutan" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.depreciation_id,
        d.asset_id,
        a.asset_code,
        a.asset_name,
        d.depreciation_date,
        d.depreciation_amount,
        d.accumulated_depreciation,
        d.book_value
      FROM asset_depreciations d
      JOIN assets a ON d.asset_id = a.asset_id
      WHERE a.status != 'disposal'
      ORDER BY d.depreciation_date DESC, a.asset_code ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil riwayat penyusutan:", err);
    res.status(500).json({ error: "Gagal mengambil riwayat penyusutan" });
  }
});

module.exports = router;