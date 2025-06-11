import User from "../model/UserModel.js";
import bcrypt from "bcrypt";

// GET SEMUA USER
async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      status: "Success",
      message: "Users Retrieved",
      data: users,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// GET USER BY ID
async function getUserById(req, res) {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });

    if (!user) {
      const error = new Error("User tidak ditemukan 😮");
      error.statusCode = 400;
      throw error;
    }

    return res.status(200).json({
      status: "Success",
      message: "User Retrieved",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// CREATE USER
async function createUser(req, res) {
  try {
    const { name, email, gender, role, password } = req.body;

    if (!name || !email || !gender || !password) {
      const error = new Error("Field tidak boleh kosong 😠");
      error.statusCode = 400;
      throw error;
    }

    const encryptPassword = await bcrypt.hash(password, 5);

    const newUser = await User.create({
      name,
      email,
      gender,
      role: role || "user",
      password: encryptPassword,
    });

    return res.status(201).json({
      status: "Success",
      message: "User Registered",
      data: newUser,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// UPDATE USER
async function updateUser(req, res) {
  try {
    let { password } = req.body;

    if (!req.body.name || !req.body.email || !req.body.gender) {
      const error = new Error("Field tidak boleh kosong 😠");
      error.statusCode = 400;
      throw error;
    }

    if (password) {
      password = await bcrypt.hash(password, 5);
    } else {
      delete req.body.password;
    }

    const ifUserExist = await User.findOne({ where: { id: req.params.id } });

    if (!ifUserExist) {
      throw new Error("User tidak ditemukan 😮");
    }

    const result = await User.update(
      { ...req.body, password },
      { where: { id: req.params.id } }
    );

    if (result[0] === 0) {
      throw new Error("Tidak ada data yang berubah");
    }

    return res.status(200).json({
      status: "Success",
      message: "User Updated",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// DELETE USER
async function deleteUser(req, res) {
  try {
    const ifUserExist = await User.findOne({ where: { id: req.params.id } });

    if (!ifUserExist) {
      const error = new Error("User tidak ditemukan 😮");
      error.statusCode = 400;
      throw error;
    }

    const result = await User.destroy({ where: { id: req.params.id } });

    if (result === 0) {
      const error = new Error("Tidak ada data yang berubah");
      error.statusCode = 400;
      throw error;
    }

    return res.status(200).json({
      status: "Success",
      message: "User Deleted",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("Email atau password salah");
      error.statusCode = 400;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Email atau password salah");
      error.statusCode = 400;
      throw error;
    }

    const { password: _, ...safeUserData } = user.toJSON();

    return res.status(200).json({
      status: "Success",
      message: "Login Berhasil",
      data: safeUserData,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// LOGOUT
async function logout(req, res) {
  try {
    // Tidak perlu cek cookie atau update DB
    return res.status(200).json({
      status: "Success",
      message: "Logout Berhasil",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
};
