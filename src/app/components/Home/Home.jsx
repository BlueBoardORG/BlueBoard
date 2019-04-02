import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Title } from "react-head";
import { withTranslation } from "react-i18next";
import slugify from "slugify";
import classnames from "classnames";
import Header from "../Header/Header";
import BoardAdder from "./BoardAdder";
import { BOARD_BG_URLS } from "../../../constants";
import "./Home.scss";

class Home extends Component {
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
  render = () => {
    const { boards, listsById, history, t, user} = this.props;
    return (
      <>
        <Title>
          {t("Home")} | {t("project_name")}
        </Title>
        <Header />
        <div className="home">
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
                  <div className="board-link-title">{board.title}</div>
                  <div className="mini-board">
                    {board.lists.map(listId => (
                      <div
                        key={listId}
                        className="mini-list"
                        style={{
                          height: `${Math.min(
                            (listsById[listId].cards.length + 1) * 18,
                            100
                          )}%`
                        }}
                      />
                    ))}
                  </div>
                </Link>
              ))}
              <BoardAdder history={history} />
            </div>
          </div>
          <div className="main-content">
          <h1>{t("Home.sharedboards")}</h1>
            <div className="boards">
              {boards.filter(board=> board.users[0].id !== user._id).map(board => (
                <Link
                  key={board._id}
                  className={classnames("board-link", board.color)}
                  style={{backgroundImage: `url(${board.backgroundImage})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}
                  to={`/b/${board._id}/${slugify(board.title, {
                    lower: true
                  })}`}
                >
                  <div className="board-link-title">{board.title}</div>
                  <div className="mini-board">
                    {board.lists.map(listId => (
                      <div
                        key={listId}
                        className="mini-list"
                        style={{
                          height: `${Math.min(
                            (listsById[listId].cards.length + 1) * 18,
                            100
                          )}%`
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

const mapStateToProps = ({ boardsById, listsById,user }) => ({
  boards: Object.keys(boardsById).map(key => boardsById[key]),
  listsById,
  user
});

export default connect(mapStateToProps)(withTranslation()(Home));
