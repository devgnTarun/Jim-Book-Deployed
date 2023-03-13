const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../Models/Note");
const { body, validationResult } = require("express-validator");

// Route 1 : Get all the notes from user
router.get("/fetchNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log("nalla coder ");
    res.status(500).send("Kuch toh garbad hai daya");
  }
});

// Route 2 : Add notes using Post request
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //IF THERE ARE ERROR OR BAD REQUEST
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log("nalla coder ");
      res.status(500).send("Kuch toh garbad hai daya");
    }
  }
);

//ROUTE 3 : UPDATE NOTE ....put method will be used not get or post

router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // CREATE A NEW OBJECT
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //FIND THE NOTE TO UPDATE AND THEN UPDATE

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Izajat nhi hai");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log("nalla coder ");
    res.status(500).send("Kuch toh garbad hai daya");
  }
});

// ROUTE 4 : DELETE THE NOTE BY DELETE METHOD

router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    //FIND THE NOTE TO delete AND THEN delete

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Izajat nhi hai");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "This not has been deleted", note: note });
  } catch (error) {
    console.log("nalla coder ");
    res.status(500).send("Kuch toh garbad hai daya");
  }
});

module.exports = router;
