if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI:
      "mongodb://rozanate:tracymacno1@ds243963.mlab.com:43963/online-reminder"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/reminder-app" };
}
