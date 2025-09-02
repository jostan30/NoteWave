import express from "express";
import { authenticate, AuthRequest } from "../middlewares/authMiddleware";
import { createNote, deleteNote, getNotes } from "../controllers/noteController";

const router = express.Router();

router.get("/" ,authenticate,getNotes);

router.post("/", authenticate,createNote);

router.delete("/:id", authenticate, (deleteNote));

export default router;
