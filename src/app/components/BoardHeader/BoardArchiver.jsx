import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import { withTranslation } from "react-i18next";
import FaArchive from "react-icons/lib/fa/archive";
import "./BoardArchiver.scss";

class BoardArchiver extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ boardId: PropTypes.string })
    }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    dispatch: PropTypes.func.isRequired
  };

  handleSelection = () => {
    const { dispatch, match, history, user, boardsById } = this.props;
    const { boardId } = match.params;
    const { isArchived } = boardsById[boardId].users.find(u => u.id === user._id);
    if(isArchived)
      dispatch({ type: "UNARCHIVE_BOARD", payload: { boardId, userId: user._id }})
    else
      dispatch({ type: "ARCHIVE_BOARD", payload: { boardId, userId: user._id } });
    history.push("/");
  };

  render = () => {
    const { t, match, boardsById, user } = this.props;
    const { boardId } = match.params;
    const { isArchived } = boardsById[boardId].users.find(u => u.id === user._id);
    return !isArchived ? (
      <Wrapper
        className="board-deleter-wrapper"
        onSelection={this.handleSelection}
      >
        <Button 
          className="board-deleter-button"
          data-tip={t("BoardHeaders.boardArchiver")}
          data-place="bottom"
        >
          <div className="modal-icon">
            <FaArchive/>
          </div>
          {/* <div className="board-header-right-text">
            &nbsp;{t("archiveBoard")}
          </div> */}
        </Button>
        <ReactTooltip/>
        <Menu className="board-deleter-menu">
          <div className="board-deleter-header">{t("are_you_sure")}</div>
          <MenuItem className="board-deleter-confirm">{t("archiveBoard.short")}</MenuItem>
        </Menu>
      </Wrapper>
    ) : (
      <Wrapper
        className="board-deleter-wrapper"
        onSelection={this.handleSelection}
      >
        <Button className="board-deleter-button">
          <div className="modal-icon">
            <FaArchive />
          </div>
          <div className="board-header-right-text">
            &nbsp;{t("unArchiveBoard")}
          </div>
        </Button>
        <Menu className="board-deleter-menu">
          <div className="board-deleter-header">{t("are_you_sure")}</div>
          <MenuItem className="board-agree-confirm">{t("unArchiveBoard.short")}</MenuItem>
        </Menu>
      </Wrapper>
    )
  };
}

const mapStateToProps = ({ user, boardsById }) => ({
  user,
  boardsById
});

export default withRouter(connect(mapStateToProps)(withTranslation()(BoardArchiver)));
