// backend/index.js
require("dotenv").config({ path: "./backend/.env" });

const connectToMongo = require('./db');
const express = require('express') 

const path = require("path");
var cors = require('cors');
 
connectToMongo();
const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/order_uploads", express.static(path.join(__dirname, "order_uploads"))); 


//available routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/products', require('./routes/products'));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/order", require("./routes/order"));

app.use("/api/admin", require("./routes/admin"));

app.listen(port, () => {
  console.log(`E-commerce backend listening at ${port}`)
})
   
     