import barang from "../model/Barangmodel.js";
import { Storage } from "@google-cloud/storage";
import { format } from "util";

// Inisialisasi Storage
const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
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
  try {
    const { Nama, harga, Deskripsi, Kategori } = req.body;

    // Validasi wajib ada
    if (!Nama || !harga || !Kategori) {
      return res.status(400).json({ message: "Nama, harga, dan kategori wajib diisi" });
    }

    // Validasi harga harus angka
    const hargaInt = parseInt(harga);
    if (isNaN(hargaInt)) {
      return res.status(400).json({ message: "Harga harus berupa angka" });
    }

    let imageUrl = null;

    // Upload gambar jika ada
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
      });

      await new Promise((resolve, reject) => {
        blobStream.on("error", (err) => {
          console.error("Upload Error:", err.message);
          reject(new Error("Gagal upload file ke GCS"));
        });
        blobStream.on("finish", resolve);
        blobStream.end(req.file.buffer);
      });

      imageUrl = format(`${process.env.GCS_PUBLIC_URL}/${bucket.name}/${fileName}`);
    }

    // Log data yang akan dikirim
    console.log("📦 Data akan disimpan:", {
      Nama,
      harga: hargaInt,
      Img: imageUrl,
      Deskripsi,
      Kategori,
    });

    // Simpan ke database
    const newBarang = await barang.create({
      Nama,
      harga: hargaInt,
      Img: imageUrl,
      Deskripsi,
      Kategori,
    });

    res.status(201).json({
      message: "Barang berhasil ditambahkan",
      barang: newBarang,
    });
  } catch (err) {
    console.error("❌ Gagal create barang:", err);

    if (err.errors) {
      err.errors.forEach(e =>
        console.error(`Field error: ${e.path} - ${e.message}`)
      );
    }

    res.status(500).json({
      message: "Gagal menambahkan barang",
      error: err.message,
      detail: err.errors || null,
    });
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
