import { Sequelize } from "sequelize";
import db from "../config/database.js";

const barang = db.define("barang", {
  Nama: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  harga: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  Img: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Deskripsi: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
  Kategori: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true, 
});

export default barang;
