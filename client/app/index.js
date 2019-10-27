import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import App from "./components/App/App";
import NotFound from "./components/App/NotFound";
import SignIn from "./components/SignIn/SignIn";
import HelloWorld from "./components/HelloWorld/HelloWorld";
import "./styles/styles.scss";

render(
  <Router>
    <App>
      <Switch>
        <Route exact path="/login" component={SignIn} />
        <Route path="/helloworld" component={HelloWorld} />
        <Route component={NotFound} />
      </Switch>
    </App>
  </Router>,
  document.getElementById("app")
);
