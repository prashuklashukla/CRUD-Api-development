const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Student = require("../models/student.model");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const newfile = Date.now() + path.extname(file.originalname);
    cb(null, newfile);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only images are allowed"), false); // reject file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
});

// All student router
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// one student router
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "User not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add new student router
router.post("/", upload.single("profite_pic"), async (req, res) => {
  try {
    // const addstudent = await Student.create(req.body);
    const student = new Student(req.body);
    if (req.file) {
      student.profite_pic = req.file.filename;
    }
    const newstudent = await student.save();
    res.status(201).json(newstudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update student router
router.put("/:id", upload.single("profite_pic"), async (req, res) => {
  try {
    const existingStudent = await Student.findById(req.params.id);

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // if new image uploaded
    if (req.file) {
      // delete old image if exists
      if (existingStudent.profite_pic) {
        const oldImagePath = path.join(
          __dirname,
          "../uploads",
          existingStudent.profite_pic,
        );

        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.log("Failed to delete old image:", err);
          } else {
            console.log("Old image deleted");
          }
        });
      }

      // save new image name
      req.body.profite_pic = req.file.filename;
    }

    // update student
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete student router
router.delete("/:id", async (req, res) => {
  try {
    const deletestudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletestudent) {
      return res.status(404).json({ message: "User not found" });
    }

    // correct condition
    if (deletestudent.profite_pic) {
      const filepath = path.join(
        __dirname,
        "../uploads",
        deletestudent.profite_pic,
      );

      fs.unlink(filepath, (err) => {
        if (err) {
          console.log("Failed to delete image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    }

    res.json({ message: "Student and image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
