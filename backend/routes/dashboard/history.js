const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
          a.asset_id,
          a.asset_code,
          a.asset_name,
          c.category_name,
          a.acquisition_cost,
          d.book_value,
          a.status
      FROM assets a
      JOIN asset_categories c ON a.category_id = c.category_id
      LEFT JOIN asset_depreciations d ON d.depreciation_id = (
          SELECT depreciation_id
          FROM asset_depreciations
          WHERE asset_id = a.asset_id
          ORDER BY depreciation_date DESC
          LIMIT 1
      )
      ORDER BY a.asset_code ASC;
    `);

    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil riwayat aset:", err);
    res.status(500).json({ error: "Gagal mengambil riwayat aset" });
  }
});

module.exports = router;