import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import classnames from "classnames";
import CardModal from "../CardModal/CardModal";
import CardBadges from "../CardBadges/CardBadges";
import { findCheckboxes } from "../utils";
import { withTranslation } from "react-i18next";
import formatMarkdown from "./formatMarkdown";
import FaComment from "react-icons/lib/fa/comments-o";
import "./Card.scss";

class Card extends Component {
  static propTypes = {
    card: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      labels: PropTypes.array,
      comments: PropTypes.array
    }).isRequired,
    listId: PropTypes.string.isRequired,
    isDraggingOver: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    assignedUserName: PropTypes.array,
    assignedUserId: PropTypes.array,
    isAbleToEdit: PropTypes.bool.isRequired,
    boardId: PropTypes.string.isRequired,
    boardUsers: PropTypes.object,
    newAssignedUser: PropTypes.array,
    needChange: PropTypes.bool
  };

  constructor() {
    super();
    this.state = {
      isModalOpen: false
    };
  }

  toggleCardEditor = () => {
    if (this.props.isAbleToEdit) {
      this.setState({ isModalOpen: !this.state.isModalOpen });
    }
  };

  handleClick = event => {
    const { tagName, checked, id } = event.target;
    if (tagName.toLowerCase() === "input") {
      // The id is a string that describes which number in the order of checkboxes this particular checkbox has
      this.toggleCheckbox(checked, parseInt(id, 10));
    } else if (tagName.toLowerCase() !== "a") {
      this.toggleCardEditor(event);
    }
    const { dispatch } = this.props;
    dispatch({
      type: "SET_CURRENT_CARD",
      payload: this.props.card._id
    });
  };

  handleKeyDown = event => {
    // Only open card on enter since spacebar is used by react-beautiful-dnd for keyboard dragging
    if (event.keyCode === 13 && event.target.tagName.toLowerCase() !== "a") {
      event.preventDefault();
      this.toggleCardEditor();
    }
  };

  // identify the clicked checkbox by its index and give it a new checked attribute
  toggleCheckbox = (checked, i) => {
    const { card, dispatch } = this.props;

    let j = 0;
    const newText = card.text.replace(/\[(\s|x)\]/g, match => {
      let newString;
      if (i === j) {
        newString = checked ? "[x]" : "[ ]";
      } else {
        newString = match;
      }
      j += 1;
      return newString;
    });

    dispatch({
      type: "CHANGE_CARD_TEXT",
      payload: { cardId: card._id, cardText: newText }
    });
  };


  checkIfUserExist = () => {
    const { dispatch,card,newAssignedUser,needChange } = this.props;
    if(needChange){
      dispatch({
        type: "UPDATE_ASSIGNED_USER",
        payload: { cardId: card._id, assignedUserId: newAssignedUser }
      });
    }
  }

  drawIcon = () => {
    const {card, t} = this.props;
    if((card.comments && card.comments.length > 0)){
      return(
        <span className="card-comments-icon" data-tip={t("Card.comments")}><FaComment/></span>
      );
    }
  }

  render() {
    const {
      card,
      index,
      listId,
      isDraggingOver,
      assignedUserName,
      assignedUserId,
      isAbleToEdit,
      boardId,
      t
    } = this.props;
    const { isModalOpen } = this.state;
    const checkboxes = findCheckboxes(card.text);
    this.checkIfUserExist();
    return (
      <>
        <Draggable
          draggableId={card._id}
          index={index}
          isDragDisabled={!isAbleToEdit}
        >
          {(provided, snapshot) => (
            <>
              {/* eslint-disable */}
              <div
                className={classnames("card-title", {
                  "card-title--drag": snapshot.isDragging
                })}
                ref={ref => {
                  provided.innerRef(ref);
                  this.ref = ref;
                }}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={event => {
                  provided.dragHandleProps && provided.dragHandleProps.onClick(event);
                  this.handleClick(event);
                }}
                onKeyDown={event => {
                  provided.dragHandleProps && provided.dragHandleProps.onKeyDown(event);
                  this.handleKeyDown(event);
                }}
                style={{
                  ...provided.draggableProps.style
                }}
              >
                {this.drawIcon()}
                  <div
                    className="card-title-html"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(card.text)
                    }}
                  />
                {/* eslint-enable */}
                {(card.date ||
                  checkboxes.total > 0 ||
                  assignedUserName ||
                  card.labels) && (
                    <CardBadges
                    cardId={card._id}
                    boardId={boardId}
                    date={card.date}
                    checkboxes={checkboxes}
                    assignedUserName={assignedUserName}
                    assignedUserId={assignedUserId}
                    labels={card.labels}
                  />
                )}
              </div>
              {/* Remove placeholder when not dragging over to reduce snapping */}
              {isDraggingOver && provided.placeholder}
            </>
          )}
        </Draggable>
          <CardModal
            isOpen={isModalOpen}
            cardElement={this.ref}
            card={card}
            listId={listId}
            isShowCommentForm
            toggleCardEditor={this.toggleCardEditor}
            assignedUserName={assignedUserName}
            assignedUserId={assignedUserId}
            boardId={boardId}
          />
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const card = state.cardsById[ownProps.cardId];
  let  assignedUser = [];
  const newAssignedUser = [];
  let needChange = false;
  if(Array.isArray(card.assignedUserId)){
    for(let i = 0; i <= card.assignedUserId.length; i++){
      if(state.boardUsersData[card.assignedUserId[i]]!== undefined ){
        assignedUser.push(state.boardUsersData[card.assignedUserId[i]]);
        newAssignedUser.push(state.boardUsersData[card.assignedUserId[i]]._id);
      }
      
      else if(Object.keys(state.boardUsersData).length !== 0 && card.assignedUserId[i] ) {
        needChange = true;
      }
    }
  }
  else if(state.boardUsersData[card.assignedUserId] !== undefined)  {
    assignedUser = [state.boardUsersData[card.assignedUserId]];
  } 
  return {
    card,
    assignedUserName:assignedUser,
    assignedUserId:assignedUser,
    boardUsers:state.boardUsersData,
    newAssignedUser,
    needChange
  };
};

export default connect(mapStateToProps)(withTranslation()(Card));
