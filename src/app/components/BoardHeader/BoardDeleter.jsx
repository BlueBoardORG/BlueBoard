import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import { withTranslation } from "react-i18next";
import FaTrash from "react-icons/lib/fa/trash";
import "./BoardDeleter.scss";
import DeleteIcon from '@material-ui/icons/Delete';

class BoardDeleter extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ boardId: PropTypes.string })
    }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    dispatch: PropTypes.func.isRequired
  };

  handleSelection = () => {
    const { dispatch, match, history } = this.props;
    const { boardId } = match.params;
    dispatch({ type: "DELETE_BOARD", payload: { boardId } });
    history.push("/");
  };

  render = () => {
    const { t } = this.props;
    return (
      <Wrapper
        className="board-deleter-wrapper"
        onSelection={this.handleSelection}
      >
        <Button 
          className="board-deleter-button"
          data-tip={t("BoardHeaders.BoardDeleter")} 
          data-place="bottom"
        >
          <DeleteIcon />
          {/* <div className="board-header-right-text">
            &nbsp;{t("BoardDeleter.delete")}
          </div> */}
        </Button>
        <ReactTooltip/>
        <Menu className="board-deleter-menu">
          <div className="board-deleter-header">{t("are_you_sure")}</div>
          <MenuItem className="board-deleter-confirm">{t("Delete")}</MenuItem>
        </Menu>
      </Wrapper>
    );
  };
}

export default withRouter(connect()(withTranslation()(BoardDeleter)));
