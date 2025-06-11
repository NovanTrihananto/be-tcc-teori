import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRoute from "./route/UserRoute.js";
import Barangroute from "./route/Barangroute.js";
import Notaroute from "./route/Notaroute.js";
import "./model/assosiasi.js"; // memuat semua model dan relasi
import db from "./config/database.js"; // untuk db.sync()

dotenv.config();

const app = express();
app.set("view engine", "ejs");

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.get("/", (req, res) => res.render("index"));
app.use(UserRoute);
app.use(Barangroute);
app.use(Notaroute);
app.use("/uploads", express.static("uploads"));

// ✅ Sync database
db.sync()
  .then(() => {
    console.log("✅ Semua tabel berhasil dibuat (synced).");
  })
  .catch((err) => {
    console.error("❌ Gagal sync database:", err);
  });
app.listen(5000, () => console.log("Server connected"));
