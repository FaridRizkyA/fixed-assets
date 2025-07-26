const express = require("express");
const router = express.Router();
const db = require("../db");
const upload = require("../middleware/upload");

const MIN_BOOK_VALUE = 1000000;

const fs = require("fs");
const path = require("path");

function moveFileToFolder(oldPath, folderName, fileName) {
  const allowedFolders = ["invoice", "certificate", "photo", "other"];
  const targetFolder = allowedFolders.includes(folderName) ? folderName : "other";
  const targetDir = path.join(__dirname, "../uploads", targetFolder);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const newPath = path.join(targetDir, fileName);
  fs.renameSync(oldPath, newPath);
  return `/uploads/${targetFolder}/${fileName}`;
}

// Ambil semua kategori
router.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM asset_categories ORDER BY category_name ASC");
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil kategori:", err);
    res.status(500).json({ error: "Gagal mengambil kategori" });
  }
});

// Ambil semua aset
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, c.category_name 
      FROM assets a
      LEFT JOIN asset_categories c ON a.category_id = c.category_id
      WHERE a.status != 'disposal'
      ORDER BY a.asset_code ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil aset:", err);
    res.status(500).json({ error: "Gagal mengambil aset" });
  }
});

// Ambil tahun terlama
router.get("/oldest-year", async (req, res) => {
  try {
    const [[row]] = await db.query(`
      SELECT MIN(YEAR(acquisition_date)) AS oldest
      FROM assets
    `);
    res.json({ oldest: row.oldest || new Date().getFullYear() });
  } catch (err) {
    console.error("Gagal mengambil tahun tertua:", err);
    res.status(500).json({ error: "Gagal mengambil data tahun tertua" });
  }
});

// Tambah batch aset + dokumen + penyusutan
router.post("/batch", upload.array("documents"), async (req, res) => {
  try {
    const rawAssets = req.body.assets;

    const assets = Array.isArray(rawAssets)
      ? rawAssets.map((a) => JSON.parse(a))
      : [JSON.parse(rawAssets)];

    if (!Array.isArray(assets) || assets.length === 0) {
      return res.status(400).json({ error: "Data aset tidak valid" });
    }

    const userId = assets[0]?.created_by;
    if (!userId) {
      return res.status(400).json({ error: "User ID tidak ditemukan" });
    }

    const files = req.files || [];

    const [latest] = await db.query(`
      SELECT asset_code FROM assets
      WHERE asset_code LIKE 'AST%'
      ORDER BY asset_id DESC LIMIT 1
    `);
    let lastCode = latest[0]?.asset_code || "AST000";

    function generateNextCode(code) {
      const lastNumber = parseInt(code.replace("AST", ""), 10);
      const nextNumber = lastNumber + 1;
      return "AST" + String(nextNumber).padStart(3, "0");
    }

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const file = files[i] || null;

      lastCode = generateNextCode(lastCode);

      const [result] = await db.query(`
        INSERT INTO assets (
          asset_code, asset_name, category_id, acquisition_date,
          acquisition_cost, location, conditions, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lastCode,
          asset.asset_name,
          asset.category_id,
          asset.acquisition_date,
          asset.acquisition_cost,
          asset.location,
          asset.conditions,
          asset.status,
          userId
        ]
      );

      const assetId = result.insertId;

      if (file && asset.document_type) {
        const finalPath = moveFileToFolder(file.path, asset.document_type, file.filename);

        await db.query(`
          INSERT INTO asset_documents (
            asset_id, document_type, file_path, uploaded_by
          ) VALUES (?, ?, ?, ?)`,
          [assetId, asset.document_type, finalPath, userId]
        );
      }

      await regenerateDepreciation(
        assetId,
        asset.category_id,
        asset.acquisition_date,
        asset.acquisition_cost
      );
    }

    res.status(201).json({ message: "Aset dan dokumen berhasil ditambahkan" });
  } catch (err) {
    console.error("Gagal menambahkan aset batch:", err);
    res.status(500).json({ error: "Gagal menambahkan aset batch" });
  }
});

// Fungsi penyusutan
async function regenerateDepreciation(asset_id, category_id, acquisition_date, acquisition_cost) {
  const [[category]] = await db.query(
    `SELECT depreciation_method, useful_life FROM asset_categories WHERE category_id = ?`,
    [category_id]
  );

  const method = category.depreciation_method;
  const usefulLife = category.useful_life;

  const startDate = new Date(acquisition_date);
  const now = new Date();
  const months = Math.max(
    0,
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth()) + 1
  );

  let records = [];

  if (method === "straight_line") {
    const monthly = acquisition_cost / (usefulLife * 12);
    let accumulated = 0;
    let book = acquisition_cost;

    for (let i = 0; i < months; i++) {
      if (book <= 0) break;
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      const depDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const depAmount = Math.min(monthly, book);
      accumulated += depAmount;
      book -= depAmount;

      records.push([
        asset_id,
        depDate.toISOString().split("T")[0],
        depAmount,
        accumulated,
        book,
      ]);
    }
  }

  if (method === "declining_balance") {
    const rate = 2 / usefulLife;
    let book = acquisition_cost;
    let accumulated = 0;

    for (let i = 0; i < months; i++) {
      if (book <= MIN_BOOK_VALUE) break;
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      const depDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const depAmount = Math.min(book * rate / 12, book);
      accumulated += depAmount;
      book -= depAmount;

      records.push([
        asset_id,
        depDate.toISOString().split("T")[0],
        depAmount,
        accumulated,
        book,
      ]);
    }
  }

  if (records.length > 0) {
    await db.query(
      `INSERT INTO asset_depreciations (
        asset_id, depreciation_date, depreciation_amount, 
        accumulated_depreciation, book_value
      ) VALUES ?`,
      [records]
    );
  }
}

// Update aset dan hitung ulang penyusutan
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    asset_name,
    category_id,
    acquisition_cost,
    location,
    acquisition_date,
    conditions,
  } = req.body;

  try {
    const [[old]] = await db.query(
      `SELECT category_id, acquisition_date FROM assets WHERE asset_id = ?`,
      [id]
    );

    const categoryChanged = old.category_id !== category_id;
    const dateChanged = old.acquisition_date.toISOString().split("T")[0] !== acquisition_date;

    await db.query(
      `UPDATE assets SET
        asset_name = ?,
        category_id = ?,
        acquisition_cost = ?,
        location = ?,
        acquisition_date = ?,
        conditions = ?
      WHERE asset_id = ?`,
      [
        asset_name,
        category_id,
        acquisition_cost,
        location,
        acquisition_date,
        conditions,
        id
      ]
    );

    if (categoryChanged || dateChanged) {
      await db.query(`DELETE FROM asset_depreciations WHERE asset_id = ?`, [id]);
      await regenerateDepreciation(id, category_id, acquisition_date, acquisition_cost);
    }

    res.json({ message: "Aset berhasil diperbarui" });
  } catch (err) {
    console.error("Gagal update aset:", err);
    res.status(500).json({ error: "Gagal update aset" });
  }
});

module.exports = router;
