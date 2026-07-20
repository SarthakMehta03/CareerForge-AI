const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

//connect to database
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


//test route
app.get("/",(req,res)=>{
    res.send("CareerForge AI backend is running...");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});