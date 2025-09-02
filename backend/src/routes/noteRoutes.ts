import express from "express";
import { authenticate, AuthRequest } from "../middlewares/authMiddleware";
import { createNote, deleteNote } from "../controllers/noteController";

const router = express.Router();

router.post("/notes", authenticate,createNote);

router.delete("/notes/:id", authenticate, (deleteNote));

export default router;
