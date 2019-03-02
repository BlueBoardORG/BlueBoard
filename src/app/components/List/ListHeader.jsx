import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import FaTrash from "react-icons/lib/fa/trash";
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
    isAbleToEdit: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      newTitle: props.listTitle
    };
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
    const { isAbleToEdit } = this.props;
    if (isAbleToEdit) {
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
    const { isOpen, newTitle } = this.state;
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
          <Wrapper
            className="delete-list-wrapper"
            onSelection={this.deleteList}
          >
            <Button className="delete-list-button">
              <FaTrash />
            </Button>
            <Menu className="delete-list-menu">
              <div className="delete-list-header">{t("are_you_sure")}</div>
              <MenuItem className="delete-list-confirm">{t("Delete")}</MenuItem>
            </Menu>
          </Wrapper>
        )}
      </div>
    );
  }
}

export default connect()(withTranslation()(ListTitle));
