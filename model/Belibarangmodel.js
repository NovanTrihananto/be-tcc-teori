import { Sequelize } from "sequelize";
import db from "../config/database.js";

// Tidak perlu import User atau kursus jika tidak pakai references langsung

const Nota = db.define("Nota", {
  idUser: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idbarang: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  Jumlah: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  harga: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  buktitf: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  pembayaran: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
}, {
  freezeTableName: true,
});

export default Nota;
