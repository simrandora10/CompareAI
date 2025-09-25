import express from "express";
import {
  register,
  login,
  deleteUser,
  getProfile,
} from "../controllers/authController.js";
import auth from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/delete", auth, deleteUser);
router.get("/getUser", auth, getProfile);

export default router;
