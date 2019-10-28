import React, { Component } from "react";
import { Typography, Button } from "@material-ui/core";
import { localStorageObjectName } from "./../SignIn/SignIn";
import { getFromStorage } from "./../../utils/storage";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

export class Account extends Component {
  state = {
    isLoading: false,
    user: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      events: [],
      signedUpFor: []
    },
    token: ""
  };

  componentDidMount() {
    this.gatherUserInformation();
    console.log("Here in account!!");
  }

  /**
   * Assigns all variables in this.state.user
   */
  gatherUserInformation = () => {
    // start isLoading
    const { token } = getFromStorage(localStorageObjectName());
    // fetch user information from new route in new api file in server
    // authenticate using token
    // assign the resulting user information to state properties

    // end isLoading
  };

  /**
   * Updates a property of some object stored in the state
   * Both parameters are strings.
   */
  updatePropertyOfObjectInState = (objectName, property, newValue) => {
    let newState = Object.assign({}, this.state);
    newState[objectName][property] = newValue;
    this.setState(newState);
  };

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <>
        <Router>
          <div>
            <Typography variant="h3" component="h3">
              h1. Heading
            </Typography>
            <p>This is your account.</p>

            <hr />

            <Link to="/mine">Mine</Link>

            <Route path="/mine" component={Test} />

            <Button
              variant="contained"
              color="primary"
              onClick={this.props.logout}
            >
              Logout
            </Button>
          </div>
        </Router>
      </>
    );
  }
}

const Test = ({ match }) => {
  return (
    <div>
      <p>Mine</p>
    </div>
  );
};

export default Account;
