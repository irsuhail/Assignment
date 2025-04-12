const express = require('express');
const Note = require('../models/note');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create Note
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = new Note({ title, content, createdBy: req.user.userId });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: 'Error creating note.' });
  }
});

// Get User Notes
router.get('/', authMiddleware, async (req, res) => {
  const notes = await Note.find({ createdBy: req.user.userId });
  res.status(200).json(notes);
});

// Update Note
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: id, createdBy: req.user.userId },
    { title, content },
    { new: true }
  );

  if (!note) return res.status(404).json({ message: 'Note not found or unauthorized.' });

  res.status(200).json(note);
});


router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const note = await Note.findOneAndDelete({
    _id: id,
    createdBy: req.user.userId,
  });

  if (!note) return res.status(404).json({ message: 'Note not found or unauthorized.' });

  res.status(200).json({ message: 'Note deleted.' });
});

module.exports = router;
