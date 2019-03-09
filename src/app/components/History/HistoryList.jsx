import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./HistoryList.scss";

class HistoryList extends Component {
  static propTypes = {};
  state = {
    history: []
  };

  componentDidMount() {
    const boardId = this.props.match.params.boardId;
    fetch("/api/history/getByBoardId", {
      method: "POST",
      body: JSON.stringify({ id: boardId }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    }).then(res => {
      if (res.status === 200) {
        res.json().then(history => {
          // reverse history to get the last action first
          this.setState({ history: history.reverse() });
        });
      }
    });
  }


  render() {
    const { history } = this.state;
    console.log(history);
    const { t } = this.props;
    const {boardUsersData} = this.props;
    return (
      <div id="history-list-container">
        <p id="title">{t("History")}</p>
        <div id="history-container">
          { history.map((historyItem, key) => (
            <div id="history-item" key={key}>
              <p>{(boardUsersData[historyItem.userId] || {name:""}).name}</p>
              <p>{t(historyItem.action)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentBoardId: state.currentBoardId,
  boardUsersData: state.boardUsersData
});

export default withRouter(
  connect(mapStateToProps)(withTranslation()(HistoryList))
);
