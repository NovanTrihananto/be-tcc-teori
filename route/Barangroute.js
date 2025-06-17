import express from "express";
import multer from "multer";
import {
  getBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
} from "../controllers/Barangcontroller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/barang", getBarang);
router.get("/barang/:id", getBarangById);
router.post("/barang", upload.single("Img"), createBarang);
router.put("/barang/:id", updateBarang);
router.delete("/barang/:id", deleteBarang);

export default router;
