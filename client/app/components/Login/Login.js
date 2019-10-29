import React, { Component } from "react";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import CircularIndeterminate from "../Loading/CircularIndeterminate";
import { getFromStorage, setInStorage } from "../../utils/storage";
import Dashboard from "./../Dashboard/Dashboard";

export function localStorageObjectName() {
  return "tryout_token"; // name of the object where login token is stored
}

export class Login extends Component {
  state = {
    showSignIn: true,
    isLoading: false,
    token: "", // if they have a token, they are signed in
    signUpError: "",
    signInError: ""
  };

  /**
   * Acquire token stored in local storage.
   * Use token to gather user information from DB.
   * This creates persistance for user login.
   */
  componentDidMount() {
    console.log("In component did mount");
    // get the localstorage object
    const obj = getFromStorage(localStorageObjectName());

    // check if anything was stored in localStorage at all by
    // checking if obj is null or not.
    if (obj && obj.token) {
      // get token from local storage
      const { token } = obj;
      console.log(`Token: ${token}`);

      // logging user in, so load screen
      this.setState({
        isLoading: true
      });

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
   * Changes to show the sign up or sign in depending on what this.state.showSignIn's value is
   */
  changeShowSignIn = () => {
    this.setState({
      showSignIn: !this.state.showSignIn
    });
  };

  logout = () => {
    this.setState({
      isLoading: true
    });
    // get the localstorage object
    const obj = getFromStorage(localStorageObjectName());

    // check if there is a token at all
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
   * 1. Post req to backend to check email and password.
   * 2. Update token for persistance.
   */
  signIn = (email, password) => {
    console.log(`Email: ${email}, Password: ${password}`);

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
        email,
        password
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage(localStorageObjectName(), { token: json.token });
          this.setState({
            signInError: json.mes,
            isLoading: false,
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

  /**
   * Runs when the user clicks the `sign up` button
   * 1. Post req to backend to add user info to database
   * 2. Send user to the sign in page to log in with their new account.
   */
  signUp = (firstName, lastName, email, username, password) => {
    console.log(firstName, lastName, email, username, password);

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
        username,
        firstName,
        lastName,
        email,
        password
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.mes,
            isLoading: false
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

  render() {
    const {
      showSignIn,
      isLoading,
      signUpError,
      signInError,
      token
    } = this.state;

    if (isLoading) {
      return <CircularIndeterminate />;
    }

    // if the user is already logged in, send them to their dashboard
    if (token) {
      return <Dashboard logout={this.logout} />;
    }

    if (showSignIn) {
      return (
        <div>
          {signInError ? <p>{signInError}</p> : ""}
          <SignIn
            changeShowSignIn={this.changeShowSignIn}
            signIn={this.signIn}
          />
        </div>
      );
    } else {
      return (
        <div>
          {signUpError ? <p>{signUpError}</p> : ""}
          <SignUp
            changeShowSignIn={this.changeShowSignIn}
            signUp={this.signUp}
          />
        </div>
      );
    }
  }
}

export default Login;
