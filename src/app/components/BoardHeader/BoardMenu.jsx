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
import MenuIcon from '@material-ui/icons/Menu';


const sideNavWidth = "350px";

class BoardMenu extends Component {
  state = {
    open: false
  };


  openSideBar = () => {
    this.setState({ open: true });
    this.refs.sideNav.style.width = sideNavWidth;
  };

  closeSideBar = () => {
    this.setState({ open: false });
    this.refs.sideNav.style.width = "0px";
  };

  menuOpen = (isMenuOpen) => {
    this.props.setMenuOpen(isMenuOpen);
  }

  render() {
    { this.menuOpen(this.state.open) }
    const { t } = this.props;
    return (
      <React.Fragment>
        <div
          style={{
            backgroundColor: "rgb(245, 246, 247)",
            color: "black",
            width: "0px",
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
            <h3 style={{ textAlign: "center", color: "black", marginBottom: "35px", letterSpacing: "1.1px", fontWeight: "500", fontSize: "22px" }}>
              {this.props.t("Menu")}
            </h3>
            <div style={{ height: "80vh" }}>
              {this.state.open ? (
                <IconButton
                  onClick={this.closeSideBar}
                  style={{
                    position: "absolute",
                    zIndex: "3",
                    left: "8px",
                    top: "8px",
                  }}
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>
              ) : null}
              {this.state.open ? (<UsersList />) : null}
              <Divider />
              <HistoryList />
            </div>
          </div>
        </div>
        <Button onClick={this.openSideBar} data-tip={t("BoardHeaders.BoardMenu")}>
          <MenuIcon style={{ color: "#ffffff" }} />
        </Button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { board } = ownProps;
  return {};
};

export default connect(mapStateToProps)(withTranslation()(BoardMenu));
