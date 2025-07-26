const db = require("../db");

const MIN_BOOK_VALUE = 1000000;

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

module.exports = { regenerateDepreciation };