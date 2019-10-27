import React, { Component } from "react";
import "whatwg-fetch";
import { getFromStorage, setInStorage } from "../../utils/storage";
import { Button, Link, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Account from "../Account/Account";

const localStorageObjectName = "login_system_storage";

const textFieldStyling = {
  margin: 8
};

// The reason I use all arrow functions is b/c you don't have to bind them!
class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "", // if they have a token, they are signed in

      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",

      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: "",
      signUpError: "",
      signUpUsername: "",

      showSignIn: true
    };
  }

  /**
   * Acquire token stored in local storage.
   * Use token to gather user information from DB.
   */
  componentDidMount() {
    console.log("In component did mount");
    // get the localstorage object
    const obj = getFromStorage(localStorageObjectName);
    if (obj && obj.token) {
      // get token from local storage
      const { token } = obj;
      console.log(`Token: ${token}`);

      // verify token
      fetch(`/api/account/verify?token=${token}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      // there is no token
      this.setState({
        isLoading: false
      });
    }
  }

  /**
   * Runs when the user clicks the `sign up` button
   * 1. Grab state
   * 2. Post req to backend
   */
  onSignUp = () => {
    // grab state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpUsername
    } = this.state;

    this.setState({
      isLoading: true
    });

    // Post req to backend
    fetch("/api/account/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: signUpUsername,
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.mes,
            isLoading: false,
            signUpEmail: "",
            signUpPassword: "",
            signUpFirstName: "",
            signUpLastName: "",
            signUpUsername: ""
          });

          // show user the sign in stuff now
          this.setState({
            showSignIn: true
          });
        } else {
          this.setState({
            signUpError: json.mes,
            isLoading: false
          });
        }
      });
  };

  /**
   * 1. Grab state
   * 2. Post req to backend
   */
  onSignIn = () => {
    // grab state
    const { signInEmail, signInPassword } = this.state;

    this.setState({
      isLoading: true
    });

    // Post req to backend
    fetch("/api/account/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage(localStorageObjectName, { token: json.token });
          this.setState({
            signInError: json.mes,
            isLoading: false,
            signInEmail: "",
            signInPassword: "",
            token: json.token
          });
        } else {
          this.setState({
            signInError: json.mes,
            isLoading: false
          });
        }
      });
  };

  logout = () => {
    this.setState({
      isLoading: true
    });
    // get the localstorage object
    const obj = getFromStorage(localStorageObjectName);
    if (obj && obj.token) {
      // get token from local storage
      const { token } = obj;

      // verify token
      fetch(`/api/account/logout?token=${token}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: "",
              isLoading: false
            });
          } else {
            // some error
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      // there is no token
      this.setState({
        isLoading: false,
        token: ""
      });
    }
  };

  /**
   *
   * @param {Where the value of the text box goes} event
   */
  onTextboxChangeSignInEmail = event => {
    this.setState({
      signInEmail: event.target.value
    });
  };

  onTextboxChangeSignInPassword = event => {
    this.setState({
      signInPassword: event.target.value
    });
  };

  onTextboxChangeSignUpFirstName = event => {
    this.setState({
      signUpFirstName: event.target.value
    });
  };

  onTextboxChangeSignUpLastName = event => {
    this.setState({
      signUpLastName: event.target.value
    });
  };

  onTextboxChangeSignUpEmail = event => {
    this.setState({
      signUpEmail: event.target.value
    });
  };

  onTextboxChangeSignUpUsername = event => {
    this.setState({
      signUpUsername: event.target.value
    });
  };

  onTextboxChangeSignUpPassword = event => {
    this.setState({
      signUpPassword: event.target.value
    });
  };

  render() {
    const {
      isLoading,
      token,
      signInError,
      signUpError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpUsername
    } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    /**
     * This should probably be broken into multiple components and conglomerated in some
     * container, but what the hell
     */
    if (!token) {
      return (
        <>
          {this.state.showSignIn ? (
            <div>
              {/* If there is an error in the sign in, show it. */}
              {signInError ? <p>{signInError}</p> : null}
              <p>Sign In</p>
              <TextField
                id="standard-email"
                label="Email"
                value={signInEmail}
                placeholder="name@email.com"
                onChange={this.onTextboxChangeSignInEmail}
                style={textFieldStyling}
                margin="normal"
              />
              <TextField
                style={textFieldStyling}
                id="standard-password-input"
                label="Password"
                value={signInPassword}
                type="password"
                placeholder="pswd1234"
                onChange={this.onTextboxChangeSignInPassword}
                margin="normal"
              />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.onSignIn}
              >
                Sign In
              </Button>
            </div>
          ) : (
            <div>
              {/* If there is an error in the sign in, show it. */}
              {signUpError ? <p>{signUpError}</p> : null}
              <p>Sign Up</p>
              <input
                type="text"
                placeholder="Danny"
                value={signUpFirstName}
                onChange={this.onTextboxChangeSignUpFirstName}
              />
              <br />
              <input
                type="text"
                placeholder="Denenberg"
                value={signUpLastName}
                onChange={this.onTextboxChangeSignUpLastName}
              />
              <br />
              <input
                type="email"
                placeholder="d@gmail.com"
                value={signUpEmail}
                onChange={this.onTextboxChangeSignUpEmail}
              />
              <br />
              <input
                type="text"
                placeholder="coolactor12"
                value={signUpUsername}
                onChange={this.onTextboxChangeSignUpUsername}
              />
              <br />
              <input
                type="password"
                placeholder="password1234"
                value={signUpPassword}
                onChange={this.onTextboxChangeSignUpPassword}
              />
              <br />
              <button onClick={this.onSignUp}>Sign Up</button>
            </div>
          )}
          <div>
            <br />
            <br />

            <Link
              component="button"
              color="primary"
              onClick={() =>
                this.setState({ showSignIn: !this.state.showSignIn })
              }
            >
              {this.state.showSignIn ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </>
      );
    }

    return (
      <>
        <div>
          <Account logout={this.logout} />
        </div>
      </>
    );
  }
}

export default SignIn;
