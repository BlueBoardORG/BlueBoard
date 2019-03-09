import React, {Component} from "react";
import PropTypes from "prop-types";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Home from "./Home/Home";
import BoardContainer from "./Board/BoardContainer";
import LandingPage from "./LandingPage/LandingPage";
import "./App.scss";
import socket from "../socketIOHandler";

// Adding I18n
import './../../i18n';

const App = ({ user, isGuest, dispatch }) => {
  // In order to attach listener only on first loading off App.
  if(!socket.hasListeners("change")){
    socket.on("change", ({action, payload}) => {
      console.log({action, payload});
      dispatch({
        type: action,
        payload,
        dontPersist: true
      })
    })
  }
 
  // Serve different pages depending on if user is logged in or not
  if (user || isGuest) {
    // when user is connected registers socket to user for updates
    socket.emit("userDetails", user);
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/b/:boardId" component={BoardContainer} />
        <Redirect to="/" />
      </Switch>
    );
  }

  // If not logged in, always redirect to landing page
  return (
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Redirect to="/" />
    </Switch>
  );
};

App.propTypes = { user: PropTypes.object, isGuest: PropTypes.bool.isRequired, dispatch: PropTypes.func.isRequired };

const mapStateToProps = state => ({ user: state.user, isGuest: state.isGuest });

// Use withRouter to prevent strange glitch where other components
// lower down in the component tree wouldn't update from URL changes
export default withRouter(connect(mapStateToProps)(App));
