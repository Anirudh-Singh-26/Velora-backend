const mongoose = require("mongoose");
const { Stock } = require("../model/StockModel");

const updateStockData = async () => {
  try {
    const stocks = await Stock.find({});
    const bulkOps = [];

    for (let stock of stocks) {
      const randomPercent = (Math.random() * 10 - 5).toFixed(4); // -5% to +5%
      const oldPrice = stock.price;
      const newPrice = +(oldPrice * (1 + randomPercent / 100)).toFixed(4);

      if (newPrice !== oldPrice) {
        bulkOps.push({
          updateOne: {
            filter: { _id: stock._id },
            update: {
              $set: {
                price: newPrice,
                percent: randomPercent,
                isDown: randomPercent < 0,
              },
            },
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      await Stock.bulkWrite(bulkOps);
    }

    console.log(`🕒 Update completed at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error("❌ Error while updating stocks:", err);
  }
};

module.exports = { updateStockData };
