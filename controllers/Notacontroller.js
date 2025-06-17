import Nota from "../model/Belibarangmodel.js";
import barang from "../model/Barangmodel.js";
import User from "../model/UserModel.js";

// Ambil semua nota
export const getNota = async (req, res) => {
  try {
    const dataNota = await Nota.findAll({
      include: [
        { model: barang, as : "barang", attributes: ['Nama', 'harga'] },
        { model: User, as : "User", attributes: ['name', 'email'] }, // opsional
      ],
    });
    res.status(200).json(dataNota);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil nota berdasarkan ID
export const getNotaById = async (req, res) => {
  try {
    const foundNota = await Nota.findOne({
      where: { id: req.params.id },
      include: [
        { model: barang, attributes: ['Nama', 'harga'] },
        { model: User, attributes: ['name', 'email'] },
      ],
    });
    if (!foundNota) return res.status(404).json({ message: "Nota tidak ditemukan" });
    res.status(200).json(foundNota);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambah nota baru (pembelian)
export const createNota = async (req, res) => {
  const { idUser, idbarang, Jumlah } = req.body;
  const buktitf = req.file ? req.file.filename : null;

  try {
    // Ambil harga barang dari database
    const dataBarang = await barang.findByPk(idbarang);
    if (!dataBarang) return res.status(404).json({ message: "Barang tidak ditemukan" });

    // Hitung total harga
    const totalHarga = parseInt(dataBarang.harga) * parseInt(Jumlah);

    // Buat nota
    await Nota.create({
      idUser,
      idbarang,
      Jumlah,
      harga: totalHarga,
      buktitf: buktitf,
      pembayaran: "pending",
    });

    res.status(201).json({ message: "Nota berhasil dibuat" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update status pembayaran atau status nota
export const updatePembayaran = async (req, res) => {
  const { pembayaran, status } = req.body;

  try {
    const nota = await Nota.findOne({ where: { id: req.params.id } });
    if (!nota) return res.status(404).json({ message: "Nota tidak ditemukan" });

    await nota.update({
      pembayaran: pembayaran || nota.pembayaran,
      status: status || nota.status,
    });

    res.status(200).json({ message: "Status pembayaran berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Hapus nota
export const deleteNota = async (req, res) => {
  try {
    const nota = await Nota.findOne({ where: { id: req.params.id } });
    if (!nota) return res.status(404).json({ message: "Nota tidak ditemukan" });

    await nota.destroy();
    res.status(200).json({ message: "Nota berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
