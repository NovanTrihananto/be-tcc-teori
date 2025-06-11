import { Sequelize } from "sequelize";

// Nyambungin db ke BE
const db = new Sequelize("toko", "root", "", {
  host: "34.60.236.179",
  dialect: "mysql",
});

export default db;