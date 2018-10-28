const express = require("express");
const router = express.Router();
const mongoose = require(`mongoose`);
const { ensureAuthenticated } = require("../helpers/auth");

// Since this router is dedicated for /reminders/..., so take out the reminders to make it /... instead;

// Load Reminders Model
require("../models/Reminder");
const Reminder = mongoose.model("reminders");

// Reminder Index Page
router.get("/", ensureAuthenticated, (req, res) => {
  Reminder.find({ user: req.user.id })
    .sort({ realDate: "desc" })
    .then(reminders => {
      res.render("reminders/index", {
        reminders: reminders
      });
    });
});

// Add Reminder Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("reminders/add");
});

// Edit Reminder Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Reminder.findOne({
    _id: req.params.id
  }).then(reminder => {
    // Check if the user is corresponding to the reminder
    if (reminder.user != req.user.id) {
      req.flash("error_message", "Action is not authorized");
      res.redirect("/reminders");
    } else {
      res.render("reminders/edit", {
        reminder: reminder
      });
    }
  });
});

// Process Reminders' Form
router.post("/", ensureAuthenticated, (req, res) => {
  // console.log(req.body);
  // res.send("ok");
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.date) {
    errors.push({ text: "Please add the event date" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add details" });
  }

  if (errors.length > 0) {
    res.render("/reminders/add", {
      errors: errors,
      title: req.body.title,
      date: req.body.date,
      details: req.body.details
    });
  } else {
    var realDate = new Date(req.body.date);
    const newUser = {
      event_title: req.body.title,
      date: req.body.date,
      realDate: realDate,
      details: req.body.details,
      user: req.user.id
    };
    new Reminder(newUser).save().then(reminder => {
      req.flash("success_message", "Reminder is added");
      res.redirect("/reminders");
    });
  }
});

// Edit Reminders' Form
router.put("/:id", ensureAuthenticated, (req, res) => {
  Reminder.findOne({
    _id: req.params.id
  }).then(reminder => {
    // update new values
    reminder.event_title = req.body.title;
    reminder.date = req.body.date;
    reminder.realDate = new Date(req.body.date);
    reminder.details = req.body.details;
    // save the updated reminder
    reminder.save().then(() => {
      req.flash("success_message", "Reminder is updated");
      res.redirect("/reminders");
    });
  });
});

// Delete Reminder
router.delete("/:id", ensureAuthenticated, (req, res) => {
  //res.send("DELETE");
  Reminder.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_message", "Reminder is removed");
    res.redirect("/reminders");
  });
  // Also works
  /*
    Reminder.remove({
      _id: req.params.id
    }).then(() => res.redirect("/reminders"));
    */
});

module.exports = router;
