const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Information stored for each user in the mongo database
 */
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    default: ""
  },
  username: {
    type: String,
    default: ""
  },
  events: [
    {
      _id: mongoose.Schema.Types.ObjectId, // generates unique Id for each event
      name: String,
      info: String,
      people: [String] // array of usernames of people who have signed up for this event
    }
  ],
  signedUpFor: [
    {
      username: String,
      eventId: String
    }
  ]
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
