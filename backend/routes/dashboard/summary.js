const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/", async (req, res) => {
  try {
    // Jumlah aset aktif
    const [[{ totalAssets }]] = await db.query(`
      SELECT COUNT(*) AS totalAssets 
      FROM assets 
      WHERE status IN ('available', 'in_use')
    `);

    // Total nilai aset aktif
    const [[{ totalValue }]] = await db.query(`
      SELECT COALESCE(SUM(acquisition_cost), 0) AS totalValue 
      FROM assets 
      WHERE status IN ('available', 'in_use')
    `);

    // Total penyusutan aset aktif
    const [[{ totalDepreciation }]] = await db.query(`
      SELECT COALESCE(SUM(d.depreciation_amount), 0) AS totalDepreciation
      FROM asset_depreciations d
      JOIN assets a ON d.asset_id = a.asset_id
      WHERE a.status IN ('available', 'in_use')
    `);

    // Jumlah aset yang dihapus
    const [[{ totalDisposed }]] = await db.query(`
      SELECT COUNT(*) AS totalDisposed 
      FROM asset_disposals
    `);

    res.json({
      totalAssets,
      totalValue,
      totalDepreciation,
      totalDisposed
    });
  } catch (err) {
    console.error("Gagal mengambil data summary:", err);
    res.status(500).json({ error: "Gagal mengambil data summary" });
  }
});

module.exports = router;