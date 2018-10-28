const express = require(`express`);
const path = require("path");
const exphbs = require(`express-handlebars`);
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require(`body-parser`);
const passport = require("passport");
const mongoose = require(`mongoose`);

const app = express();

// Load routes
const reminders = require("./routes/reminders");
const users = require("./routes/users");

// Load Passport Config
require("./config/passport")(passport);

// Map global promise
mongoose.Promise = global.Promise;

// Database Config
const database = require("./config/database");

// Connect to mongoose (Local Server)
// mongoose
//   .connect(
//     "mongodb://localhost/reminder-app",
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log("MongoDB Connected..."))
//   .catch(err => console.log(err));

// Coonect to mongoose (Deployment)
// mongoose
//   .connect(
//     "mongodb://rozanate:tracymacno1@ds243963.mlab.com:43963/online-reminder",
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log("MongoDB Connected..."))
//   .catch(err => console.log(err));

// Connect to mongoose (Dynamically)
mongoose
  .connect(
    database.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser - parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse applicaiton/json
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Method Override Middleware
app.use(methodOverride("_method"));

// Express-Session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passportjs Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Global Variables
app.use(function(req, res, next) {
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;

  // Call the next middleware
  next();
});

// Index Route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use Routes
app.use("/reminders", reminders);
app.use("/users", users);

// Setting port number to 5000 - (Local Server)
// const port = 5000;

// Port Number for deploying to heroku
const port = process.env.PORT || 5000;

// Tell Server to listen to localhost:5000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
