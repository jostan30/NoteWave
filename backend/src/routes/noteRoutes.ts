import express from "express";
import { authenticate, AuthRequest } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/notes", authenticate, (req: AuthRequest, res) => {
  res.json({ message: `Note created by ${req.user?.name}` });
});

router.delete("/notes/:id", authenticate, (req: AuthRequest, res) => {
  res.json({ message: `Note deleted by ${req.user?.name}` });
});

export default router;
