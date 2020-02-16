import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import { withTranslation } from "react-i18next";
import FaArchive from "react-icons/lib/fa/archive";
import "./BoardArchiver.scss";
import ArchiveIcon from '@material-ui/icons/Archive';
import UnArchiveIcon from '@material-ui/icons/Unarchive';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class BoardArchiver extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ boardId: PropTypes.string })
    }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isDialogOpen: false,
    }
  }

  handleDialogClose = () => {
    this.setState({ isDialogOpen: false });
  }

  handleDialogOpen = () => {
    this.setState({ isDialogOpen: true });
  }

  handleSelection = () => {
    const { dispatch, match, history, user, boardsById } = this.props;
    const { boardId } = match.params;
    const { isArchived } = boardsById[boardId].users.find(u => u.id === user._id);
    if (isArchived)
      dispatch({ type: "UNARCHIVE_BOARD", payload: { boardId, userId: user._id } })
    else
      dispatch({ type: "ARCHIVE_BOARD", payload: { boardId, userId: user._id } });
    history.push("/");
  };

  render = () => {
    const { t, match, boardsById, user } = this.props;
    const { boardId } = match.params;
    const { isArchived } = boardsById[boardId].users.find(u => u.id === user._id);

    return !isArchived ? (
      <div>
        <Button
          onClick={this.handleDialogOpen}
          className="board-deleter-button"
          data-tip={t("BoardHeaders.boardArchiver")}
          data-place="bottom"
        >
          <ArchiveIcon />
        </Button>
        <ReactTooltip />

        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="delete-list"
          aria-describedby="delete-list-dialog"
        >
          <DialogTitle id="alert-dialog-title">{t("archiveBoard.short")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("are_you_sure")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              {t("Cancel")}
            </Button>
            <Button onClick={this.handleSelection} color="secondary" autoFocus>
              {t("archiveBoard")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>

    ) : (

        <div>
          <Button
            onClick={this.handleDialogOpen}
            className="board-deleter-button"
            data-tip={t("unArchiveBoard")}
            data-place="bottom"
          >
            <UnArchiveIcon />
            {/* <div className="board-header-right-text">
            &nbsp;{t("archiveBoard")}
          </div> */}
          </Button>
          <ReactTooltip />

          <Dialog
            open={this.state.isDialogOpen}
            onClose={this.handleDialogClose}
            aria-labelledby="delete-list"
            aria-describedby="delete-list-dialog"
          >
            <DialogTitle id="alert-dialog-title">{t("unArchiveBoard.short")}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t("are_you_sure")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDialogClose} color="primary">
                {t("Cancel")}
              </Button>
              <Button onClick={this.handleSelection} color="secondary" autoFocus>
                {t("unArchiveBoard")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )
  };
}

const mapStateToProps = ({ user, boardsById }) => ({
  user,
  boardsById
});

export default withRouter(connect(mapStateToProps)(withTranslation()(BoardArchiver)));
