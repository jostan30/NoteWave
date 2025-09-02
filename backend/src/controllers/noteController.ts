import { AuthRequest } from "../middlewares/authMiddleware"; 
import Note from "../models/Note";

export const createNote = async (req: AuthRequest, res: any) => {
  try {
    const { title } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newNote = new Note({
      title,
      userId: req.user.id, 
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteNote = async (req: AuthRequest, res: any) => {
  try {
    const noteId = req.params.id;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const note = await Note.findById(noteId);       
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    if (note.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }             
};


export const getNotes = async (req: AuthRequest, res: any) => {
  try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

  
      const notes = await Note.find({ userId: req.user.id });
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }     
};