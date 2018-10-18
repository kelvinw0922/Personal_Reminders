const express = require(`express`);
const exphbs = require(`express-handlebars`);
const bodyParser = require(`body-parser`);
const mongoose = require(`mongoose`);

const app = express();

// Map global promise
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose
  .connect(
    "mongodb://localhost/reminder-app",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Load Reminders Model

require("./models/Reminders");
const Reminder = mongoose.model("reminders");

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser - parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse applicaiton/json
app.use(bodyParser.json());

// Index Route
app.get("/", (req, res) => {
  const title = "Welcome Nigger";
  res.render("index", {
    title: title
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Add Reminder Form
app.get("/reminders/add", (req, res) => {
  res.render("reminders/add");
});

// Process Reminders' Form
app.post("/reminders", (req, res) => {
  // console.log(req.body);
  // res.send("ok");
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add details" });
  }

  if (errors.length > 0) {
    res.render("/reminders/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      event_title: req.body.title,
      details: req.body.details
    };
    new Reminder(newUser).save().then(reminder => {
      res.redirect("/reminders");
    });
  }
});

// Setting port number to 5000
const port = 5000;

// Tell Server to listen to localhost:5000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
