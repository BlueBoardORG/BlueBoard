import "@babel/polyfill";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Home from "./Home/Home";
import Archive from "./Archive/Archive";
import BoardContainer from "./Board/BoardContainer";
import LandingPage from "./LandingPage/LandingPage";
import BoardNotFound from '../components/ErrorPages/BoardNotFound/BoardNotFound';
import "./App.scss";
import socket from "../socketIOHandler";

// Adding I18n
import './../../i18n';

const App = ({ user, isGuest, dispatch }) => {
  // In order to attach listener only on first loading off App.
  if (!socket.hasListeners("change")) {
    socket.on("change", ({ action, payload }) => {
      dispatch({
        type: action,
        payload,
        dontPersist: true
      })
    })
  }

  const interval = setInterval(() => {
    if (socket.connected) {
      dispatch({
        type: "TOGGLE_SOCKET_CONNECTION",
        payload: true,
        dontPersist: true
      })
      clearInterval(interval);
    }
  }, 10);

  if (!socket.hasListeners("reconnect")) {
    socket.on("reconnect", () => {
      window.location.reload();
    })
  }

  if (!socket.hasListeners("disconnect")) {
    socket.on("disconnect", () => {
      dispatch({
        type: "TOGGLE_SOCKET_CONNECTION",
        payload: false,
        dontPersist: true
      })
    })
  }

  //Serve different pages depending on if user is logged in or not
  if (user || isGuest) {
    // when user is connected registers socket to user for updates
    socket.emit("userDetails", { user });
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/archive" component={Archive} />
        <Route path="/b/:boardId" component={BoardContainer} />
        <Route path="/boardNotFound" component={BoardNotFound} />
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
