import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Title } from "react-head";
import { withTranslation } from "react-i18next";
import Header from "../Header/Header";
import BoardList from "../BoardList/BoardList";
import { BOARD_BG_URLS } from "../../../constants";
import { YesodotLogo } from '../YesodotLogo/YesodotLogo';
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
    history: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  componentDidMount = () => {
    const { boards, dispatch } = this.props;
    boards.forEach(board => {
      const boardImageBackground = board.backgroundImage;
      if (!boardImageBackground) {
        const image = BOARD_BG_URLS[Math.floor(Math.random() * BOARD_BG_URLS.length)];
        dispatch({ type: "CHANGE_BOARD_IMAGE", payload: { boardId: board._id, backgroundImage: image } });
      }
    })
  }

  render = () => {
    const { boards, history, t, user } = this.props;
    const myBoards = boards.filter(board => board.users[0].id === user._id && !board.users[0].isArchived);
    const mySharedBoards = boards.filter(board => board.users[0].id !== user._id && !board.users.find(u => u.id === user._id).isArchived);
    return (
      <>
        <Title>
          {t("Home")} | {t("project_name")}
        </Title>
        <Header />
        <div className="home-page">
          <div className="main-content">
            <h1>{t("Home.myboards")}</h1>
            <BoardList boards={myBoards} history={{ history }} />
          </div>
          <div className="main-content">
            <h1>{t("Home.sharedboards")}</h1>
            <BoardList boards={mySharedBoards} shouldAllowAddingBoard={false} history={{ history }} />
          </div>
          <YesodotLogo />
        </div>
      </>
    );
  };
}

const mapStateToProps = ({ boardsById, listsById, user, socketConnected }) => ({
  boards: Object.keys(boardsById).map(key => boardsById[key]),
  listsById,
  user,
  socketConnected
});

export default connect(mapStateToProps)(withTranslation()(Home));
