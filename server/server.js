const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiResumeRoutes = require("./routes/aiResumeRoutes");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();

//connect to database
connectDB().then(async () => {
  try {
    const { reconcileAllStaleReservations } = require("./services/creditService");
    reconcileAllStaleReservations();
  } catch (err) {
    console.warn("[Server] Credit reservation recovery init error:", err.message);
  }

  // Safe first-admin bootstrap check if configured via environment variable
  try {
    if (process.env.FIRST_ADMIN_EMAIL) {
      const User = require("./models/User");
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount === 0) {
        const targetEmail = process.env.FIRST_ADMIN_EMAIL.trim().toLowerCase();
        const existing = await User.findOne({ email: targetEmail });
        if (existing) {
          existing.role = "admin";
          existing.status = "active";
          await existing.save();
          console.log(`[Bootstrap] Elevated ${targetEmail} to initial administrator.`);
        }
      }
    }
  } catch (bootstrapErr) {
    console.warn("[Server] Initial admin bootstrap check:", bootstrapErr.message);
  }
}).catch(() => {});

const app = express();

//middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Static directory for uploaded avatars
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai/resume", aiResumeRoutes);
app.use("/api/admin", adminRoutes);

//test route
app.get("/",(req,res)=>{
    res.send("CareerForge AI backend is running...");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});