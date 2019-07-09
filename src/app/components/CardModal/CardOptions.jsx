import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FaTrash from "react-icons/lib/fa/trash";
import FaUserPlus from "react-icons/lib/fa/user-plus";
import { FaCheckSquare } from "react-icons/lib/fa";
import { withTranslation } from "react-i18next";
import MdAlarm from "react-icons/lib/md/access-alarm";
import Calendar from "./Calendar";
import ClickOutside from "../ClickOutside/ClickOutside";
import UserPicker from "../UserPicker/UserPicker";
import colorIcon from "../../../assets/images/color-icon.png";
import "./CardOptions.scss";
import shortid from "shortid";
import { colorsWithLabels } from "../utils";

class CardOptions extends Component {
  static propTypes = {
    isColorPickerOpen: PropTypes.bool.isRequired,
    card: PropTypes.shape({ _id: PropTypes.string.isRequired }).isRequired,
    listId: PropTypes.string.isRequired,
    isCardNearRightBorder: PropTypes.bool.isRequired,
    isThinDisplay: PropTypes.bool.isRequired,
    boundingRect: PropTypes.object.isRequired,
    toggleColorPicker: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    boardId: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      isCalendarOpen: false,
      isCheckOpen: false,
      isAssignOpen: false
    };
  }
  deleteCard = () => {
    const { dispatch, listId, card } = this.props;
    dispatch({
      type: "DELETE_CARD",
      payload: { cardId: card._id, listId }
    });
  };

  addLabel = label => {
    const { dispatch, card } = this.props;
    const cardLabels = card.labels || [];
    let isIncludes = false;
    cardLabels.map((cardLabel) =>{
      if(cardLabel.id === label.id)
      {
        isIncludes = true;
      }
    })
    if (isIncludes) {
      dispatch({
        type: "DELETE_LABEL",
        payload: { label, cardId: card._id }
      });
    } else {
      dispatch({
        type: "ADD_LABEL",
        payload: { label, cardId: card._id }
      });
    }
  };

  addLabelToBoard = labelToAdd =>{
    const { dispatch, boardId } = this.props;
    dispatch({
      type: "ADD_LABEL_TO_BOARD",
      payload: {boardId: boardId,labelToAdd}
    });
  };

  handleKeyDown = event => {
    if (event.keyCode === 27) {
      this.props.toggleColorPicker();
      this.colorPickerButton.focus();
    }
  };

  handleClickOutside = () => {
    const { toggleColorPicker } = this.props;
    toggleColorPicker();
    this.colorPickerButton.focus();
  };

  toggleCalendar = () => {
    this.setState({ isCalendarOpen: !this.state.isCalendarOpen });
  };

  toggleAssign = () => {
    this.setState({ isAssignOpen: !this.state.isAssignOpen });
  };

  toggleCheck = () => {
    this.setState({ isCheckOpen: !this.state.isCheckOpen });
  };

  addCheckList = e => {
    if (e.key === "Enter") {
      const { dispatch, card } = this.props;
      if(!e.target.value.trim()) {
        return this.toggleCheck();
      }
      dispatch({
        type: "CHANGE_CARD_TEXT",
        payload: {
          cardId: card._id,
          cardText: `${card.text} \n [ ] ${e.target.value}`
        }
      });
      e.target.value = "";
    }
  };
  render() {
    const {
      isCardNearRightBorder,
      isColorPickerOpen,
      toggleColorPicker,
      card,
      isThinDisplay,
      boundingRect,
      t
    } = this.props;

    const { isCalendarOpen, isCheckOpen, isAssignOpen } = this.state;

    const calendarStyle = {
      content: {
        top: Math.min(boundingRect.bottom + 10, window.innerHeight - 300),
        left: boundingRect.left
      }
    };

    const calendarMobileStyle = {
      content: {
        top: 110,
        left: "50%",
        transform: "translateX(-50%)"
      }
    };

    return (
      <div
        className="options-list"
        style={{
          alignItems: isCardNearRightBorder ? "flex-end" : "flex-start"
        }}
      >
        <div>
          <button onClick={this.deleteCard} className="options-list-button btn-3">
            <div className="modal-icon">
              <FaTrash />
            </div>
            &nbsp;{t("Delete")}
          </button>
        </div>
        <div className="modal-color-picker-wrapper">
          <button
            className="options-list-button btn-3"
            onClick={toggleColorPicker}
            onKeyDown={this.handleKeyDown}
            ref={ref => {
              this.colorPickerButton = ref;
            }}
            aria-haspopup
            aria-expanded={isColorPickerOpen}
          >
            <img src={colorIcon} alt="colorwheel" className="modal-icon" />
            &nbsp;{t("Tags")}
          </button>
          {isColorPickerOpen && (
            <ClickOutside
              eventTypes="click"
              handleClickOutside={this.handleClickOutside}
            >
              {/* eslint-disable */}
              <div
                className="modal-color-picker"
                onKeyDown={this.handleKeyDown}
              >
              <button 
              className="color-picker-color"
              onClick={() => this.addLabelToBoard({id:shortid.generate(),title:"תגית חדשה",color:"gray"})} >+</button>

                {/* eslint-enable */}
                {
                  this.props.boardLabels.map((label,index) => {
                  const labelName = label.title;
                  const labelcolor = label.color;
                  return(<button
                    key={index}
                    style={{
                      background: labelcolor,
                      fontSize: 10,
                    }}
                    className="color-picker-color"
                    onClick={() => this.addLabel(label)}
                  >{labelName}</button>);
                })}
              </div>
            </ClickOutside>
          )}
        </div>
        <div>
          <button onClick={this.toggleCalendar} className="options-list-button btn-3">
            <div className="modal-icon">
              <MdAlarm />
            </div>
            &nbsp;{t("Due-Date")}
          </button>
        </div>
        <div>
          <button onClick={this.toggleAssign} className="options-list-button btn-3">
            <div className="modal-icon">
              <FaUserPlus />
            </div>
            &nbsp;{t("CardOptions.assign")}
          </button>
        </div>
        <div>
          <button onClick={this.toggleCheck} className="options-list-button btn-3">
            <div className="modal-icon">
              <FaCheckSquare />
            </div>&nbsp;{t("CardOptions.check_list")}
          </button>
        </div>
        <Modal
          isOpen={isCheckOpen}
          onRequestClose={this.toggleCheck}
          overlayClassName="checkList-underlay"
          className="checkList-modal"
          style={isThinDisplay ? calendarMobileStyle : calendarStyle}
        >
          <input
            className="input"
            placeholder={t("CardOptions.check_list.placeholder")}
            onKeyPress={this.addCheckList}
            autoFocus
          />
        </Modal>
        <Modal
          isOpen={isCalendarOpen}
          onRequestClose={this.toggleCalendar}
          overlayClassName="modal-underlay"
          className="picker-modal"
          style={isThinDisplay ? calendarMobileStyle : calendarStyle}
        >
          <Calendar
            cardId={card._id}
            date={card.date}
            toggleCalendar={this.toggleCalendar}
          />
        </Modal>
        <Modal
          isOpen={isAssignOpen}
          onRequestClose={this.toggleAssign}
          overlayClassName="modal-underlay"
          className="picker-modal"
          style={isThinDisplay ? calendarMobileStyle : calendarStyle}
        >
          <UserPicker cardId={card._id} toggleAssign={this.toggleAssign} />
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const boardLabel = state.boardsById[ownProps.boardId].labels;
  const cardLabel = state.cardsById[ownProps.card._id].labels;
  return {
    boardLabels:boardLabel,
    cardLabels:cardLabel
  };
};

export default connect(mapStateToProps)(withTranslation()(CardOptions));
