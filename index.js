const express= require("express");
const app= express();
require('dotenv').config();
const mongoose= require("mongoose");
const { Holding } = require("./model/HoldingsModel.js");
const { Position } = require("./model/PositionModel.js");
const { Order } = require("./model/OrderModel.js");
const cors= require("cors");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");
const {User}= require("./model/UserModel.js");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("./middleware/authMiddleware.js");
const {Stock}= require("./model/StockModel.js");
const { updateStockData } = require("./updateStock/updateStock.js");

const PORT= process.env.PORT || 3002;
const url= process.env.MONGO_URL;

app.listen(PORT, ()=>{
    console.log("Server Started");
});

let updateInterval;

mongoose.connect(url).then(() => {
  console.log("Db Connected");
  if (process.env.NODE_ENV === "production") {
    updateInterval = setInterval(updateStockData, 8000);
  }
});
// Graceful shutdown
const shutdown = async () => {
  try {
    console.log("Shutting down gracefully...");
    await mongoose.connection.close(); // ✅ No callback used
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const allowedOrigins = [process.env.FRONTEND_URL, process.env.DASHBOARD_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Stock Updater is Running!");
});


app.get("/allHoldings", verifyToken, async (req, res) => {
  let allHoldings = await Holding.find({});
  // console.log(allHoldings);
  res.json(allHoldings);
});

app.get("/allPositions", verifyToken, async (req, res) => {
  let allPositions = await Position.find({});
  // console.log(allPositions);
  res.json(allPositions);
});

app.post("/newOrder",verifyToken, async (req, res) => {
  console.log("Order")
  try{
    console.log("try")
    console.log(req.user)
    console.log(req.user.id)
    let newOrder = new Order({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
      orderBy: req.user.id,
    });
    await newOrder.save();
    res.send("Order saved!");
  } catch(e){
    console.log("catch")
    console.log(e)
    res.status(400).json({msg:`Server/order : ${e}`})
  }
});


////////////////
app.post("/signup", async (req, res)=>{
    const {username, email, password}= req.body;
    try{
        let existingUser= await User.findOne({username});
        if(existingUser) {
            return res.status(400).json({msg:"User already exists"});
        }
        let hashedPass=await bcrypt.hash(password, 8);
        let newUser= new User({
            username: username,
            email: email,
            password: hashedPass,
        });
        await newUser.save();
        res.status(201).json({msg: "Signup successful"})
    }catch(err){
        res.status(500).json({ msg: "Signup failed", error: err.message });
    }
});

app.post("/login", async (req, res)=>{
    const {username, password}= req.body;

    try {
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
        return res.status(404).json({ msg: "User Not Found" });
      }

      const passMatch = await bcrypt.compare(password, existingUser.password);
      if (!passMatch) {
        return res.status(401).json({ msg: "Invalid Username or Password" });
      }

      const token = jwt.sign(
        { id: existingUser._id, username: existingUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000,
      });

      res.status(200).json({ msg: "LogIn Successful"});
    } catch (err) {
      res.status(500).json({ msg: "Login failed", error: err.message });
    }   
});

app.get("/me", verifyToken, async (req, res) => {
  try {
    const currUser = await User.findById(req.user.id).select("-password");
    if (!currUser) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    res.json(currUser);
  } catch (err) {
    console.error("Error in /me:", err.message);
    res.status(500).json({ msg: "Failed to fetch user", error: err.message });
  }
});
app.post("/logout", (req, res)=>{
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ msg: "Logged out successfully" });
});

/////////////////////////////////
// const {watchlist}= require("../dashboard/src/data/data.js")


const apiKey= process.env.STOCK_API_KEY;
let formatted = [];

async function fetchAndFormatStockData() {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${apiKey}`
  );
  const data = await response.json();

  formatted = data.slice(0, 10).map((stock) => {
    const isDown = parseFloat(stock.changesPercentage) < 0;
    return {
      name: stock.symbol,
      price: parseFloat(stock.price),
      percent: stock.changesPercentage,
      isDown,
    };
  });
}

// Call this once at app startup
fetchAndFormatStockData();

app.get("/allWatchList", async(req, res)=>{
  await Stock.deleteMany({});
  const data = formatted;
  console.log(data)
  await Stock.insertMany(data);

  const allStocks= await Stock.find({});
  res.status(200).json(allStocks);
});

app.get("/getUpdatedList", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch updated stock data" });
  }
});

app.get("/orders",verifyToken ,async (req, res)=>{
  console.log("/orders")
  let id = req.user.id;
  try{
    console.log("try")
    let order = await Order.find({
      orderBy: new mongoose.Types.ObjectId(id),
    });
  console.log(order);
  res.status(200).json(order)
  } catch(e){
    console.log("catch")
  }
})

app.post("/deleteOrder", verifyToken, async (req, res)=>{
  console.log("DeleteOrder")
  try{
    console.log("DeleteOrder try");
    let {id}= req.body;
    console.log(id)
  let order= await Order.findByIdAndDelete(id);
  console.log(order)
  if(!order){
    return res.status(404).json("Order Not Found");
  }
  res.status(200).json({msg: "Order Deleted"})
  } catch(e){
    console.log("DeleteOrder catch");
    console.log(e)
    res.status(500).json({msg: "Server Error"})
  }
})

// to clear the stock data forcefully
app.get("/emptyStock", async (req, res)=>{
  await Stock.deleteMany({});
  res.status(200).json({ msg: "All stocks deleted" });
})

app.get("/ping", (req, res) => {
  res.send("pong");
});


app.use((req, res) => {
  console.warn(`404 - Not Found: ${req.originalUrl}`);
  res.status(404).json({ msg: "Route not found" });
});



