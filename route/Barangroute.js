import express from "express";
import upload from "../middleware/upload.js";
import {
  getBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
} from "../controllers/Barangcontroller.js";

const router = express.Router();

router.get("/barang", getBarang);
router.get("/barang/:id", getBarangById);
router.post("/barang", upload.single("Img"), createBarang);
router.put("/barang/:id", updateBarang);
router.delete("/barang/:id", deleteBarang);

export default router;
