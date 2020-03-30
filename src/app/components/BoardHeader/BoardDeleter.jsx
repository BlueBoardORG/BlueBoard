import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { withTranslation } from "react-i18next";
import "./BoardDeleter.scss";
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class BoardDeleter extends Component {
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
    const { dispatch, match, history } = this.props;
    const { boardId } = match.params;
    dispatch({ type: "DELETE_BOARD", payload: { boardId } });
    history.push("/");
  };

  render = () => {
    const { t } = this.props;
    return (
      <div>
        <Button
          onClick={this.handleDialogOpen}
          className="board-deleter-button"
          data-tip={t("BoardHeaders.BoardDeleter")}
          data-place="bottom"
        >
          <DeleteIcon />
        </Button>
        <ReactTooltip />

        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="delete-list"
          aria-describedby="delete-list-dialog"
        >
          <DialogTitle id="alert-dialog-title">{t("DELETE_BOARD")}</DialogTitle>
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
              {t("Delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

export default withRouter(connect()(withTranslation()(BoardDeleter)));
