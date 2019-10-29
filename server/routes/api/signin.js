const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
const mongoose = require("mongoose");

// must execute the following to use User.findOneAndUpdate() function
mongoose.set("useFindAndModify", false);

module.exports = app => {
  // app.get('/api/counters', (req, res, next) => {
  //   Counter.find()
  //     .exec()
  //     .then((counter) => res.json(counter))
  //     .catch((err) => next(err));
  // });
  // app.post('/api/counters', function (req, res, next) {
  //   const counter = new Counter();
  //   counter.save()
  //     .then(() => res.json(counter))
  //     .catch((err) => next(err));
  // });

  /**
   * Sign up
   */
  app.post("/api/account/signup", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email, username } = body; // needs to be mutable unlike above

    if (!firstName) {
      return res.send({
        success: false,
        mes: "Error: First name cannot be blank."
      });
    }

    if (!lastName) {
      return res.send({
        success: false,
        mes: "Error: Last name cannot be blank."
      });
    }

    if (!email) {
      return res.send({
        success: false,
        mes: "Error: Email name cannot be blank."
      });
    }

    if (!password) {
      return res.send({
        success: false,
        mes: "Error: Password name cannot be blank."
      });
    }

    email = email.toLowerCase(); // email should always go in db in lowercase form
    username = username.toLowerCase(); // username should always go in db in lowercase form

    /**
     * Steps:
     * 1. Verify email doesn't exist
     * 2. Verify username doesn't exist
     * 2. Save user in DB
     */
    // check email
    User.find(
      {
        email
      },
      (err, previousUsers) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error."
          });
        } else if (previousUsers.length > 0) {
          // if someone already is using that email
          return res.send({
            success: false,
            mes: "Error: Account already exists."
          });
        }

        /* Email wasn't previously used, now check username */
        User.find(
          {
            username
          },
          (err, previousUsernameUsers) => {
            if (err) {
              return res.send({
                success: false,
                mes: "Error: Server error."
              });
            } else if (previousUsernameUsers.length > 0) {
              // if someone already is using that username
              return res.send({
                success: false,
                mes: "Error: Account already exists."
              });
            }
            // Save the new user
            const newUser = new User();
            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.password = newUser.generateHash(password);
            newUser.username = username;
            newUser.events = [];
            newUser.signedUpFor = [];

            newUser.save((err, user) => {
              if (err) {
                return res.send({
                  success: false,
                  mes: "Error: Server error."
                });
              }

              return res.send({
                success: true,
                mes: "Signed up."
              });
            });
          }
        );
      }
    );
  });

  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body; // needs to be mutable unlike above

    if (!email) {
      return res.send({
        success: false,
        mes: "Error: Email name cannot be blank."
      });
    }

    if (!password) {
      return res.send({
        success: false,
        mes: "Error: Password name cannot be blank."
      });
    }

    email = email.toLowerCase();

    /**
     * Find the user in the DB with the given email
     */
    User.find(
      {
        email
      },
      (err, users) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error #0."
          });
        }
        // if there are zero users found (there cannot be more than one user found--it's impossible)
        if (users.length != 1) {
          return res.send({
            success: false,
            mes: "Error: Invalid"
          });
        }

        /**
         * Check the user's password
         */
        const user = users[0];
        // if invalid password (defined in the schema)
        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            mes: "Error: Invalid"
          });
        }

        // otherwise, create user session
        /**
         * Everytime users log in, they will get a token.
         * The token is generated using the _id property of the new document created on the server.
         * This will verify that they have already successfully logged in.
         * If you feel you need to revoke their access, mark their document to `isDeleted: true`
         */
        console.log("About to create new UserSession");
        let userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
          if (err) {
            console.log("error A");
            return res.send({
              success: false,
              mes: "Error: Server error #1."
            });
          }
          console.log("success A");
          return res.send({
            success: true,
            mes: "Valid sign in.",
            token: doc._id // the _id property that Mongo gives each document by default used to tell if a user can log in
          });
        });
      }
    );
  });

  app.get("/api/account/verify", (req, res, next) => {
    /**
     * 1. Get the token
     * 2. Verify the token is one of a kind and is not deleted
     */

    // get token
    const { query } = req;
    const { token } = query; //?token=test
    console.log(`Token: ${token}`);

    // Verify the token is one of a kind and is not deleted
    UserSession.find(
      {
        _id: token,
        isDeleted: false
      },
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error"
          });
        }

        if (sessions.length != 1) {
          return res.send({
            success: false,
            mes: "Error: Invalid"
          });
        } else {
          return res.send({
            success: true,
            mes: "Good"
          });
        }
      }
    );
  });

  app.post("/api/account/logout", (req, res, next) => {
    const { query } = req;
    const { token } = query; //?token=test

    // Verify the token is one of a kind and is not deleted
    UserSession.findOneAndUpdate(
      {
        _id: token,
        isDeleted: false
      },
      {
        $set: { isDeleted: true }
      },
      null,
      (err, session) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error."
          });
        }

        // if there aren't any documents found by that token
        if (!session) {
          return res.send({
            success: false,
            mes: "Error: Invalid token."
          });
        }

        // otherwise, everything went fine and dandy
        return res.send({
          success: true,
          mes: "Good"
        });
      }
    );
  });
};
