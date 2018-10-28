const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReminderSchema = new Schema({
  event_title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  realDate: {
    type: Date,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  }
});

mongoose.model("reminders", ReminderSchema);
