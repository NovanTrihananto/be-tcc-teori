import barang from "../model/Barangmodel.js";
import { Storage } from "@google-cloud/storage";
import { format } from "util";

// Inisialisasi Storage
const storage = new Storage();
const bucket = storage.bucket(process.env.d01_7); 
// GET all barang
export const getBarang = async (req, res) => {
  try {
    const dataBarang = await barang.findAll();
    res.status(200).json(dataBarang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET barang by ID
export const getBarangById = async (req, res) => {
  try {
    const foundBarang = await barang.findOne({
      where: { id: req.params.id },
    });
    if (!foundBarang) return res.status(404).json({ message: "Barang tidak ditemukan" });
    res.status(200).json(foundBarang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE barang
export const createBarang = async (req, res) => {
  const { Nama, harga, Deskripsi, Kategori } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "Gambar tidak ditemukan" });

  try {
    const fileName = `${Date.now()}-${file.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    await new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        console.error("Upload Error:", err.message);
        reject(new Error("Gagal upload file ke GCS"));
      });
      blobStream.on("finish", resolve);
      blobStream.end(file.buffer);
    });

    // Buat file jadi public
    await blob.makePublic();

    const imageUrl = format(`https://storage.googleapis.com/${bucket.name}/${fileName}`);

    await barang.create({
      Nama,
      harga,
      Img: imageUrl,
      Deskripsi,
      Kategori,
    });

    res.status(201).json({ message: "Barang berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE barang
export const updateBarang = async (req, res) => {
  const { Nama, harga, Img, Deskripsi, Kategori } = req.body;
  try {
    const existingBarang = await barang.findOne({
      where: { id: req.params.id },
    });

    if (!existingBarang) return res.status(404).json({ message: "Barang tidak ditemukan" });

    await existingBarang.update({
      Nama,
      harga,
      Img,
      Deskripsi,
      Kategori,
    });

    res.status(200).json({ message: "Barang berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE barang
export const deleteBarang = async (req, res) => {
  try {
    const existingBarang = await barang.findOne({
      where: { id: req.params.id },
    });

    if (!existingBarang) return res.status(404).json({ message: "Barang tidak ditemukan" });

    await existingBarang.destroy();
    res.status(200).json({ message: "Barang berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
