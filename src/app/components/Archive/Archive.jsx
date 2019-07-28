import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Title } from "react-head";
import { withTranslation } from "react-i18next";
import BoardList from "../BoardList/BoardList";
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
    const { boards, history, t, user} = this.props;
    const myArchivedBoards = boards.filter(board=> board.users.filter(boardUser=> boardUser.id === user._id && boardUser.isArchived).length > 0);
    return (
      <>
        <Title>
          {t("Home")} | {t("project_name")}
        </Title>
        <Header />
        <div className="archive">
          <div className="main-content">
            <h1>{t("archive.boards")}</h1>
            <BoardList boards={myArchivedBoards} shouldAllowAddingBoard={false} history={{history}}/>
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

export default connect(mapStateToProps)(withTranslation()(Archive));
