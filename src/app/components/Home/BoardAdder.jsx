import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import slugify from "slugify";
import shortid from "shortid";
import ClickOutside from "../ClickOutside/ClickOutside";
import { withTranslation } from 'react-i18next';

class BoardAdder extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  constructor() {
    super();
    this.state = { isOpen: false, title: "" };
  }

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleChange = event => {
    this.setState({ title: event.target.value });
  };
  defaultLabels = () => {

    return [{ id: shortid.generate(), title: "בטיפול", color: "violet" },
    { id: shortid.generate(), title: "כללי", color: "Turquoise" },
    { id: shortid.generate(), title: "מעקב", color: "yellowgreen" },
    { id: shortid.generate(), title: "תקלה", color: "Gold" },
    { id: shortid.generate(), title: "עזרה", color: "Orange" },
    { id: shortid.generate(), title: "קריטי", color: "tomato" }]
  }

  handleSubmit = event => {
    // Dispatch action to put new empty board in redux store and db + push new url to history
    event.preventDefault();
    const { title } = this.state;
    if (title === "") {
      return;
    }
    const { dispatch, userId } = this.props;
    const boardId = shortid.generate();
    const labels = this.defaultLabels();
    dispatch({
      type: "ADD_BOARD",
      payload: {
        boardTitle: title,
        boardId,
        userId,
        labels
      }
    });

    this.setState({ isOpen: false, title: "" });
  };

  handleKeyDown = event => {
    if (event.keyCode === 27) {
      this.setState({ isOpen: false });
    }
  };

  render = () => {
    const { isOpen, title } = this.state;
    const { t, i18n } = this.props;
    return isOpen ? (
      <ClickOutside handleClickOutside={this.toggleOpen}>
        <form onSubmit={this.handleSubmit} className="board-adder-form">
          <input
            autoFocus
            className="submit-board-input"
            type="text"
            value={title}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            spellCheck={false}
          />
          <input
            type="submit"
            value="Create"
            className="submit-board-button"
            disabled={title === ""}
          />
        </form>
      </ClickOutside>
    ) : (
        <button onClick={this.toggleOpen} className="add-board-button">
          {t('Add-new-board')}
        </button>
      );
  };
}

const mapStateToProps = state => ({
  userId: state.user ? state.user._id : "guest"
});

export default connect(mapStateToProps)(withTranslation()(BoardAdder));
