import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Summary from "../models/Summary.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findOne({ id });
    if (!user) return res.status(400).json({ error: "User does not exist" });
    const deleteSummary = await Summary.deleteMany({ userId: id });
    const deleteUser = await User.deleteOne({ _id: id });
    res
      .status(200)
      .json({ message: "User Deleted", deleteSummary, deleteUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const getProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(400).json({ error: "User does not exist" });
    res
      .status(200)
      .json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export { register, login, getProfile, deleteUser };
