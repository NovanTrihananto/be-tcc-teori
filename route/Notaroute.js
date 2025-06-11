import express from "express";
import upload from "../middleware/upload.js";
import {
  getNota,
  getNotaById,
  createNota,
  updatePembayaran,
  deleteNota,
} from "../controllers/Notacontroller.js";

const router = express.Router();

router.get("/nota", getNota);
router.get("/nota/:id", getNotaById);
router.post("/nota",upload.single("buktitf"), createNota); // bukti transfer pakai upload
router.put("/nota/:id", updatePembayaran);
router.delete("/nota/:id", deleteNota);

export default router;
