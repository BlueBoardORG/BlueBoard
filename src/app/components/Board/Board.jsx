import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Title } from "react-head";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import classnames from "classnames";
import { withTranslation } from "react-i18next";
import Modal from "react-modal";
import List from "../List/List";
import ListAdder from "../ListAdder/ListAdder";
import Header from "../Header/Header";
import BoardHeader from "../BoardHeader/BoardHeader";
import { loadBoardUsersData } from "../../actions/boardActions";
import { CAN_EDIT_ROLES } from "../../../constants";
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
    cards:PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      startX: null,
      startScrollX: null
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
    const {dispatch,cards,boardLabels} = this.props;
    const newLabelFormat=[];
    const map ={'inprogress':boardLabels[0].id,
                'general':boardLabels[1].id,
                'tracking':boardLabels[2].id,
                'bug':boardLabels[3].id,
                'help':boardLabels[4].id,
                'critical':boardLabels[5].id};
    cards[cardId].labels.forEach(label => {
      newLabelFormat.push(map[label]);
    });
    dispatch({
      type: "FIX_LABELS_FORMAT",
      payload: { newLabelFormat, cardId }
    });
  }

  checkFormat= (lists) => {
    const {cards} = this.props;
    const oldLabels = ["inprogress","general","tracking","bug","help","critical",]
    lists.forEach(list => {
      list.cards.forEach(cardId => {
        if(cards[cardId].labels && oldLabels.includes(cards[cardId].labels[0])){
          this.updateFormat(cardId);
        }
      });
    });
  }

  render = () => {
    
    const { lists, boardTitle, boardId, boardColor, t, user, board, boardImageBackground, socketConnected } = this.props;
    const imageUrl = `url(${boardImageBackground})`;
    const wrapperStyle = {
      backgroundImage: imageUrl,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    };
    const userData = board.users.find(u => u.id === user._id) || {};
    const isAbleToEdit = CAN_EDIT_ROLES.includes(userData.role) && socketConnected;
    
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        width                 : '25%',
        height                : '25%'
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
            <h1 style={{textAlign: "center", alignContent:"center", float:"none", margin:"auto"}}> {t("connection.wait")} </h1>
            <p style={{textAlign: "center", alignContent:"center", float:"none", margin:"auto", paddingTop: "5vh"}}> {t("connection.wait.message")} </p>
          </Modal>
          <BoardHeader isAbleToEdit={isAbleToEdit}/>
          {/* eslint-disable jsx-a11y/no-static-element-interactions */}
          <div
            className="lists-wrapper"
            onMouseDown={this.handleMouseDown}
            onWheel={this.handleWheel}
          >
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
    cards : state.cardsById,
    lists: board.lists.map(listId => state.listsById[listId]),
    boardTitle: board.title,
    boardColor: board.color,
    boardId: board._id,
    boardUsers: board.users,
    boardImageBackground: board.backgroundImage,
    user,
    boardUsersData, 
    socketConnected,
    boardLabels:board.labels
  };
};

export default connect(mapStateToProps)(withTranslation()(Board));
