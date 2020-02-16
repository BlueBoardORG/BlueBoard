import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactTooltip from "react-tooltip";
import { withTranslation } from "react-i18next";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import "./BoardLeave.scss";

class BoardLeave extends Component {
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

  componentWillMount() {
    Modal.setAppElement('body');
  }

  handleDialogClose = () => {
    this.setState({ isDialogOpen: false });
  }

  handleDialogOpen = () => {
    this.setState({ isDialogOpen: true });
  }

  handleSelection = () => {
    const { dispatch, match, user } = this.props;
    const { boardId } = match.params;

    dispatch({
      type: "REMOVE_USER",
      payload: { boardId, userIdToRemove: user._id }
    });
    document.location.href = "/";
  };

  render = () => {
    const { t } = this.props;
    return (
      <div>
        <Button
          onClick={this.handleDialogOpen}
          className="board-deleter-button"
          data-tip={t("BoardHeaders.BoardLeave")}
          data-place="bottom"
        >
          <ExitToApp />
        </Button>
        <ReactTooltip />

        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="delete-list"
          aria-describedby="delete-list-dialog"
        >
          <DialogTitle id="alert-dialog-title">{t("BoardLeave.Leave")}</DialogTitle>
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
              {t("BoardLeave.short")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}
const mapStateToProps = state => ({ user: state.user });

export default withRouter(
  connect(mapStateToProps)(withTranslation()(BoardLeave))
);
