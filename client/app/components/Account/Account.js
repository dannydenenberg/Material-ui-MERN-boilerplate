import React, { Component } from "react";
import { Typography, Button } from "@material-ui/core";

export class Account extends Component {
  state = {
    isLoading: false,
    
  };
  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <>
        <div>
          <Typography variant="h3" component="h3">
            h1. Heading
          </Typography>
          <p>This is your account.</p>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.logout}
          >
            Logout
          </Button>
        </div>
      </>
    );
  }
}

export default Account;
