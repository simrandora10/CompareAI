import jwt from "jsonwebtoken";
export default (req, res, next) => {
  const auth = req.headers.authorization;
  console.log(auth);
  if (!auth) return res.status(401).json({ error: "No token" });
  const parts = auth.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ error: "Bad token format" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
