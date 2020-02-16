import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import "./ListHeader.scss";
import { withTranslation } from "react-i18next";

class ListTitle extends Component {
  static propTypes = {
    listTitle: PropTypes.string.isRequired,
    listId: PropTypes.string.isRequired,
    boardId: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(PropTypes.string).isRequired,
    dragHandleProps: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isAbleToEdit: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      newTitle: props.listTitle,
      isDeleteDialogOpen: false
    };
  }

  handleDeleteDialogOpen = () => {
    this.setState({ isDeleteDialogOpen: true })
  }

  handleDeleteDialogClose = () => {
    this.setState({ isDeleteDialogOpen: false })
  }

  handleChange = event => {
    this.setState({ newTitle: event.target.value });
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.handleSubmit();
    } else if (event.keyCode === 27) {
      this.revertTitle();
    }
  };

  handleSubmit = () => {
    const { newTitle } = this.state;
    const { listTitle, listId, dispatch } = this.props;
    if (newTitle === "") return;
    if (newTitle !== listTitle) {
      dispatch({
        type: "CHANGE_LIST_TITLE",
        payload: { listTitle: newTitle, listId }
      });
    }
    this.setState({ isOpen: false });
  };

  revertTitle = () => {
    this.setState({ newTitle: this.props.listTitle, isOpen: false });
  };

  deleteList = () => {
    const { listId, cards, boardId, dispatch } = this.props;
    dispatch({
      type: "DELETE_LIST",
      payload: { cards, listId, boardId }
    });
  };

  openTitleEditor = () => {
    if (this.props.isAbleToEdit) {
      this.setState({ isOpen: true });
    }
  };

  handleButtonKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.openTitleEditor();
    }
  };

  render() {
    const { isOpen, newTitle, isDeleteDialogOpen } = this.state;
    const { dragHandleProps, listTitle, t, isAbleToEdit } = this.props;
    return (
      <div className="list-header">
        {isOpen ? (
          <div className="list-title-textarea-wrapper">
            <Textarea
              autoFocus
              useCacheForDOMMeasurements
              value={newTitle}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              className="list-title-textarea"
              onBlur={this.handleSubmit}
              spellCheck={false}
              disabled={!isAbleToEdit}
            />
          </div>
        ) : (
            <div
              {...dragHandleProps}
              role="button"
              tabIndex={0}
              onClick={this.openTitleEditor}
              onKeyDown={event => {
                this.handleButtonKeyDown(event);
                dragHandleProps && dragHandleProps.onKeyDown(event);
              }}
              className="list-title-button"
            >
              {listTitle}
            </div>
          )}
        {isAbleToEdit && (
          [
            <IconButton style={{marginTop: "2px", marginLeft:"2px"}} onClick={this.handleDeleteDialogOpen} aria-label="delete">
              <DeleteIcon />
            </IconButton>,
            <Dialog
              open={isDeleteDialogOpen}
              onClose={this.handleDeleteDialogClose}
              aria-labelledby="delete-list"
              aria-describedby="delete-list-dialog"
            >
              <DialogTitle id="alert-dialog-title">{t("LIST_REMOVAL")} {` "${listTitle}"`}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {t("are_you_sure")}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleDeleteDialogClose} color="primary">
                  {t("Cancel")}
                </Button>
                <Button onClick={this.deleteList} color="secondary" autoFocus>
                  {t("Delete")}
                </Button>
              </DialogActions>
            </Dialog>
          ])}
      </div>
    );
  }
}

export default connect()(withTranslation()(ListTitle));
