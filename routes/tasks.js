const router = require("express").Router();
const Task = require("../models/tasks");

// Create a Task
router.post("/", async (req, res) => {
  const newTask = new Task(req.body);
  try {
    const savedTask = await newTask.save();
    res.status(200).json(savedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update existing Task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task.username === req.body.username) {
      try {
        const updatedTask = await Task.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedTask);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your task!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task.username === req.body.username) {
      try {
        await task.deleteOne();
        res.status(200).json("Task has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your task!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Tasks
router.get("/", async (req, res) => {
  const username = req.query.user;

  try {
    let tasks;
    if (username) {
      tasks = await Task.find({ username });
    } else {
      tasks = await Task.find();
    }
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
