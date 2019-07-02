import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import slugify from "slugify";
import classnames from "classnames";
import BoardAdder from "../Home/BoardAdder";
import { BOARD_BG_URLS } from "../../../constants";
import "./BoardList.scss";

class BoardList extends Component {
  static propTypes = {
    listsById: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount = () => {
    const { boards, dispatch } = this.props;
    boards.forEach(board=>{
      const boardImageBackground = board.backgroundImage;
      if(!boardImageBackground){
        const image = BOARD_BG_URLS[Math.floor(Math.random()*BOARD_BG_URLS.length)];
        dispatch({ type: "CHANGE_BOARD_IMAGE", payload: { boardId:board._id, backgroundImage: image} });
      }
    })
  }

  getColor = color => {
    const colors = {
      "red": "rgba(80, 50, 50, 0.65)",
      "pink": "rgba(70, 20, 50, 0.75)",
      "blue": "rgba(50, 60, 80, 0.75)",
      "green": "rgba(70, 100, 90, 0.65)"
    }
    return colors[color] || "rgba(255, 255, 255, 0.4)";
  }

  render = () => {
    const { boards, listsById, history, shouldAllowAddingBoard=true} = this.props;
    console.log(boards);
    return (
        <div className="boards">
            {boards.map(board => (
            <Link
                key={board._id}
                className={classnames("board-link", board.color)}
                style={{backgroundImage: `url(${board.backgroundImage})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}
                to={`/b/${board._id}/${slugify(board.title, {
                lower: true
                })}`}
            >
                <div className="board-link-title" style={{backgroundColor: this.getColor(board.color), marginBottom: "5px"}}>
                {board.title}
                </div>
                <div className="mini-board">
                {board.lists.map(listId => (
                    <div
                    key={listId}
                    className="mini-list"
                    style={{
                        height: `${Math.min(
                        (listsById[listId].cards.length + 1) * 18,
                        100
                        )}%`,
                        backgroundColor: this.getColor(board.color)
                    }}
                    />
                ))}
                </div>
            </Link>
            ))}
            {this.props.socketConnected && shouldAllowAddingBoard ? (<BoardAdder history={history} />) : ""}
        </div>
    )};
}

const mapStateToProps = ({ listsById,user, socketConnected }) => ({
  listsById,
  user,
  socketConnected
});

export default connect(mapStateToProps)(withTranslation()(BoardList));
