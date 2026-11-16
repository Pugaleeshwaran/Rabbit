// Load .env before anything else so every file can read process.env
require("dotenv").config();

// Optional: some networks (e.g. Windows Mobile Hotspot) break Node's DNS lookup
// for mongodb+srv:// URIs. Set DNS_SERVERS in .env only on machines that need it.
if (process.env.DNS_SERVERS) {
    require("dns").setServers(process.env.DNS_SERVERS.split(",").map((s) => s.trim()));
}

const express = require("express");
const cors = require("cors");
const app = express();
const connectDb = require('./config/db');
const userRoutes = require('./routes/UserRoutes');
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/CheckoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subcribeRoutes = require("./routes/subcribeRoute");
const adminRoutes = require("./routes/adminRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderoutes = require("./routes/adminOrderRoutes");

app.use(cors())
app.use(express.json())

console.log(process.env.PORT);


// connect database
connectDb()
const PORT = process.env.PORT || 3000;

//API Routes
app.use("/api/users", userRoutes);
// product api

app.use("/api/products", productRoutes)
//cart api
app.use("/api/cart", cartRoutes);
//checkout api
app.use("/api/checkout", checkoutRoutes);
//My order APi
app.use("/api/orders", orderRoutes);
//image API
app.use("/api/upload", uploadRoutes);
//Newletter API
app.use("/api", subcribeRoutes);
//admin api
app.use("/api/admin/users", adminRoutes);
//admin product details
app.use("/api/admin/products", adminProductRoutes)
//admin Order Routers
app.use("/api/admin/orders", adminOrderoutes);

app.get("/", (req, res) => {
    res.send("welcome to a Rabbit Backend API !.....")
})
app.listen(PORT, function () {
    console.log("server Start....", `http://localhost:${PORT}/`)
})