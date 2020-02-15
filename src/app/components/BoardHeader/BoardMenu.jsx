import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Divider from '@material-ui/core/Divider';
import { connect } from "react-redux";
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Button from '@material-ui/core/Button';
import "./BoardMenu.scss";
import UsersList from "../Users/UsersList";
import HistoryList from "../History/HistoryList";

const sideNavWidth = "400px";

class BoardMenu extends Component {
  state = {
    open: true
  };

  openSideBar = () => {
    this.setState({ open: true });
    this.refs.sideNav.style.width = sideNavWidth;
  };

  closeSideBar = () => {
    this.setState({ open: false });
    this.refs.sideNav.style.width = "0px";
  };

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            backgroundColor: "rgb(245, 246, 247)",
            width: sideNavWidth,
            height: "calc(100vh - 50px)",
            zIndex: "2",
            transition: "0.5s",
            bottom: "0%",
            position: "fixed",
            left: "0px",
            top: "50px"
          }}
          ref="sideNav"
        >
          <div>
            <h3 style={{ textAlign: "center", color: "black" }}>
              {this.props.t("Menu")}
            </h3>
            <hr
              style={{
                backgroundColor: "rgba(9,45,66,.13)",
                border: 0,
                height: "1px",
                margin: "16px 0",
                padding: 0,
                width: "100%"
              }}
            />
            <div style={{ height: "80vh" }}>
              {this.state.open ? (
                <IconButton
                  onClick={this.closeSideBar}
                  style={{
                    position: "absolute",
                    zIndex: "3",
                    right: "0px",
                    top: "10px",
                  }}
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>
              ) : null}
              <UsersList />
              <Divider />
              <HistoryList />
            </div>
          </div>
        </div>
        {!this.state.open ? (
          <Button
            onClick={this.openSideBar}
            color="primary"
            style={{
              position: "absolute",
              zIndex: "3",
              left: "0px",
              top: "164px",
              height: "45px",
              backgroundColor: "#36363694",
              borderBottomLeftRadius: "0px",
              borderTopLeftRadius: "0px",
              color: "#ffffffe6"
            }}
            endIcon={<KeyboardArrowRightIcon />}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { board } = ownProps;
  return {};
};

export default connect(mapStateToProps)(withTranslation()(BoardMenu));
