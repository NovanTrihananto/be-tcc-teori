import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  login,
  logout,
} from "../controllers/Usercontroller.js";

const router = express.Router();
// Endpoint buat login & logout
router.post("/login", login);
router.delete("/logout", logout);


router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser,);
router.delete("/users/:id", deleteUser);

export default router;
