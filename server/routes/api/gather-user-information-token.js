const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

module.exports = app => {
  app.get("/api/accounts/get", (req, res, next) => {
    console.log("got it");
    res.send("Working!!");
  });
};
