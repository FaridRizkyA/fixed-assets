const express = require("express");
const router = express.Router();
const db = require("../db");
const { regenerateDepreciation } = require("../utils/depreciationUtils");

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

router.get("/check-and-update", async (req, res) => {
  try {
    const [assets] = await db.query(`
      SELECT a.asset_id, a.acquisition_date, a.acquisition_cost, a.category_id
      FROM assets a
      WHERE a.status != 'disposal'
    `);

    const [lastEntries] = await db.query(`
      SELECT asset_id, MAX(DATE_FORMAT(depreciation_date, '%Y-%m')) AS last_period
      FROM asset_depreciations
      GROUP BY asset_id
    `);

    const lastMap = Object.fromEntries(lastEntries.map(e => [e.asset_id, e.last_period]));

    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    let updated = 0;
    for (const asset of assets) {
      const last = lastMap[asset.asset_id];

      if (!last || last < currentPeriod) {
        await regenerateDepreciation(
          asset.asset_id,
          asset.category_id,
          asset.acquisition_date,
          asset.acquisition_cost
        );
        updated++;
      }
    }

    res.json({ message: "Penyusutan diperiksa", updated });
  } catch (err) {
    console.error("Gagal update penyusutan bulanan:", err);
    res.status(500).json({ error: "Gagal update penyusutan" });
  }
});

module.exports = router;