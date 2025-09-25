import express from "express";
import auth from "../utils/authMiddleware.js";
import {
  createSummary,
  listSummaries,
  getSummary,
  compareSummaries,
  deleteSummary,
} from "../controllers/summaryController.js";

const router = express.Router();

router.post("/", auth, createSummary);
router.get("/", auth, listSummaries);
router.get("/:id", auth, getSummary);
router.post("/compare", auth, compareSummaries);
router.delete("/:id", auth, deleteSummary);

export default router;
