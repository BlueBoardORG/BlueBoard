import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Title } from "react-head";
import { withTranslation } from "react-i18next";
import slugify from "slugify";
import classnames from "classnames";
import Header from "../Header/Header";
import { BOARD_BG_URLS } from "../../../constants";
import "./Archive.scss";

class Archive extends Component {
  static propTypes = {
    boards: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,
    listsById: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
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
    const { boards, listsById, history, t, user} = this.props;
    return (
      <>
        <Title>
          {t("Home")} | {t("project_name")}
        </Title>
        <Header />
        <div className="archive">
          <div className="main-content">
            <h1>{t("Home.myboards")}</h1>
            <div className="boards">
              {boards.filter(board=> board.users[0].id === user._id).map(board => (
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
                          )
                        }%`,
                        backgroundColor: this.getColor(board.color)
                        }}
                      />
                    ))}
                  </div>
                </Link>
              ))}
              
            </div>
          </div>
        </div>
      </>
    );
  };
}

const mapStateToProps = ({ boardsById, listsById,user, socketConnected }) => ({
  boards: Object.keys(boardsById).map(key => boardsById[key]),
  listsById,
  user,
  socketConnected
});

export default connect(mapStateToProps)(withTranslation()(Archive));
