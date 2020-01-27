import React, { Component } from "react";
import PropTypes, { nominalTypeHack } from "prop-types";
import { connect } from "react-redux";
import { Title } from "react-head";
import Iframe from "react-iframe";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import classnames from "classnames";
import { withTranslation } from "react-i18next";
import Modal from "react-modal";
import List from "../List/List";
import ListAdder from "../ListAdder/ListAdder";
import Header from "../Header/Header";
import BoardHeader from "../BoardHeader/BoardHeader";
import { loadBoardUsersData } from "../../actions/boardActions";
import { CAN_EDIT_ROLES, ROCKETCHAT_URL } from "../../../constants";
import "./Board.scss";
import BoardMenu from "../BoardHeader/BoardMenu";


class Board extends Component {
  static propTypes = {
    lists: PropTypes.arrayOf(
      PropTypes.shape({ _id: PropTypes.string.isRequired })
    ).isRequired,
    boardId: PropTypes.string.isRequired,
    boardTitle: PropTypes.string.isRequired,
    boardColor: PropTypes.string.isRequired,
    boardImageBackground: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    boardUsers: PropTypes.array,
    boardLabels: PropTypes.array.isRequired,
    cards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      startX: null,
      startScrollX: null,
      iFrame:false
    };
  }

  // boardId is stored in the redux store so that it is available inside middleware
  componentDidMount = () => {
    const { boardId, dispatch, boardUsers } = this.props;
    dispatch({
      type: "PUT_BOARD_ID_IN_REDUX",
      payload: { boardId }
    });

    const sharedUserIds = boardUsers.map(user => user.id);
    loadBoardUsersData(dispatch, sharedUserIds);
  };

  handleDragEnd = ({ source, destination, type }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }
    const { dispatch, boardId } = this.props;

    // Move list
    if (type === "COLUMN") {
      // Prevent update if nothing has changed
      if (source.index !== destination.index) {
        dispatch({
          type: "MOVE_LIST",
          payload: {
            oldListIndex: source.index,
            newListIndex: destination.index,
            boardId: source.droppableId
          }
        });
      }
      return;
    }
    // Move card
    if (
      source.index !== destination.index ||
      source.droppableId !== destination.droppableId
    ) {
      dispatch({
        type: "MOVE_CARD",
        payload: {
          sourceListId: source.droppableId,
          destListId: destination.droppableId,
          oldCardIndex: source.index,
          newCardIndex: destination.index,
          boardId
        }
      });
    }
  };

  // The following three methods implement dragging of the board by holding down the mouse
  handleMouseDown = ({ target, clientX }) => {
    if (target.className !== "list-wrapper" && target.className !== "lists") {
      return;
    }
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    this.setState({
      startX: clientX,
      startScrollX: window.scrollX
    });
  };

  // Go to new scroll position every time the mouse moves while dragging is activated
  handleMouseMove = ({ clientX }) => {
    const { startX, startScrollX } = this.state;
    const scrollX = startScrollX - clientX + startX;
    window.scrollTo(scrollX, 0);
    const windowScrollX = window.scrollX;
    if (scrollX !== windowScrollX) {
      this.setState({
        startX: clientX + windowScrollX - startScrollX
      });
    }
  };

  // Remove drag event listeners
  handleMouseUp = () => {
    if (this.state.startX) {
      window.removeEventListener("mousemove", this.handleMouseMove);
      window.removeEventListener("mouseup", this.handleMouseUp);
      this.setState({ startX: null, startScrollX: null });
    }
  };

  handleWheel = ({ target, deltaY }) => {
    // Scroll page right or left as long as the mouse is not hovering a card-list (which could have vertical scroll)
    if (
      target.className !== "list-wrapper" &&
      target.className !== "lists" &&
      target.className !== "open-composer-button" &&
      target.className !== "list-title-button"
    ) {
      return;
    }
    // Move the board 80 pixes on every wheel event
    if (Math.sign(deltaY) === 1) {
      window.scrollTo(window.scrollX + 80, 0);
    } else if (Math.sign(deltaY) === -1) {
      window.scrollTo(window.scrollX - 80, 0);
    }
  };

  updateFormat = (cardId) => {
    const { dispatch, cards, boardLabels } = this.props;
    const newLabelFormat = [];
    const map = {
      'inprogress': boardLabels[0].id,
      'general': boardLabels[1].id,
      'tracking': boardLabels[2].id,
      'bug': boardLabels[3].id,
      'help': boardLabels[4].id,
      'critical': boardLabels[5].id
    };
    cards[cardId].labels.forEach(label => {
      newLabelFormat.push(map[label]);
    });
    dispatch({
      type: "FIX_LABELS_FORMAT",
      payload: { newLabelFormat, cardId }
    });
  }

  checkFormat = (lists) => {
    const { cards } = this.props;
    const oldLabels = ["inprogress", "general", "tracking", "bug", "help", "critical",]
    lists.forEach(list => {
      list.cards.forEach(cardId => {
        if (cardId && cards[cardId].labels && oldLabels.includes(cards[cardId].labels[0])) {
          this.updateFormat(cardId);
        }
      });
    });
  }
  iFrameChange = () =>{
    const {iFrame} = this.state;
    window._paq ? window._paq.push(["trackEvent", "TOGGLE_HI_CHAT", !iFrame]) : null;
    this.setState({iFrame: !iFrame});
  }

   getAllowedGroupTitleFromText = title => {
    if (this.cache && this.cache[title])
        return this.cache[title];

    const isAlphaNumeric = 'a-zA-Z0-9';
    const isHebrewChars = 'א-ת';
    const isAllowedSpecialChars = '_.-';
    const regexString = `^${isAlphaNumeric}${isHebrewChars}${isAllowedSpecialChars}`;
    const regexExppresion = new RegExp(`[${regexString}]`, 'g');
    const allowedTitle = title.replace(regexExppresion, str => str.split('').map(() => '.').join(''));

    this.cache = this.cache || {};
    this.cache[title] = allowedTitle;

    return this.cache[title];
}

  render = () => {

    const { lists, boardTitle, boardId, boardColor, t, user, board, boardImageBackground, socketConnected ,chatRoomId} = this.props;
    const {iFrame} = this.state;
    const imageUrl = `url(${boardImageBackground})`;
    const hiUrl = `${ROCKETCHAT_URL}/${encodeURIComponent(`${this.getAllowedGroupTitleFromText(boardTitle)}-${boardId}`)}`;
    const wrapperStyle = {
      backgroundImage: imageUrl,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    };
    const userData = board.users.find(u => u.id === user._id) || {};
    const isAbleToEdit = CAN_EDIT_ROLES.includes(userData.role) && socketConnected;
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '25%',
        height: '25%'
      }
    };
    this.checkFormat(lists);
    return (
      <>
        <div className={classnames("board", boardColor)} style={wrapperStyle}>
          <Title>
            {boardTitle} | {t("project_name")}
          </Title>
          <Header />
          <Modal
            isOpen={!socketConnected}
            contentLabel="Waiting for connection"
            style={customStyles}
          >
            <h1 style={{ textAlign: "center", alignContent: "center", float: "none", margin: "auto" }}> {t("connection.wait")} </h1>
            <p style={{ textAlign: "center", alignContent: "center", float: "none", margin: "auto", paddingTop: "5vh" }}> {t("connection.wait.message")} </p>
          </Modal>
          
          <BoardHeader isAbleToEdit={isAbleToEdit} iFrameAction={this.iFrameChange} chatRoomId={chatRoomId}/>
          {/* eslint-disable jsx-a11y/no-static-element-interactions */}
          <div
            className="lists-wrapper"
            onMouseDown={this.handleMouseDown}
            onWheel={this.handleWheel}
          >
           {iFrame ? <p style={window.CSS.suppports('display:contents') ? {display: "contents"} : {height: '98%'}}>  <Iframe url= {hiUrl}
           className="iframe"/>  </p> : null}
                    

            {/* eslint-enable jsx-a11y/no-static-element-interactions */}
            <DragDropContext onDragEnd={this.handleDragEnd}>
              <Droppable
                droppableId={boardId}
                type="COLUMN"
                direction="horizontal"
              >
                
                {provided => (
                  <div className="lists" id="lists" ref={provided.innerRef}>
                    {lists.map((list, index) => (
                      <List
                        list={list}
                        boardId={boardId}
                        index={lists.length - 1 - index}
                        key={list._id}
                        isAbleToEdit={isAbleToEdit}
                      />
                    ))}
                    {provided.placeholder}
                    {isAbleToEdit && <ListAdder boardId={boardId} />}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <BoardMenu />
          </div>
          <div className="board-underlay" style={wrapperStyle} />
        </div>
      </>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  const { board } = ownProps;
  const { user, boardUsersData, socketConnected } = state;
  return {
    chatRoomId: board.chatRoomId,
    cards: state.cardsById,
    lists: board.lists.map(listId => state.listsById[listId]),
    boardTitle: board.title,
    boardColor: board.color,
    boardId: board._id,
    boardUsers: board.users,
    boardImageBackground: board.backgroundImage,
    user,
    boardUsersData,
    socketConnected,
    boardLabels: board.labels
  };
};

export default connect(mapStateToProps)(withTranslation()(Board));
