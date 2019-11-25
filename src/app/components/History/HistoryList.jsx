import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner, Pane } from 'evergreen-ui';
import "./HistoryList.scss";
import socket from '../../socketIOHandler';
import { HISTORY_ITEMS_PER_FETCH } from "../../../constants";

class HistoryList extends Component {
  static propTypes = {};
  state = {
    history: [],
    isLoading: false,
    shouldFetch: true
  };

  componentDidMount() {
    const { boardId } = this.props.match.params;
    this.fetchData();

    socket.on("historyItem", ({ action, boardId: changedBoardId, userId, date }) => {
      if (boardId === changedBoardId)
        this.setState({
          history: [{ action, changedBoardId, userId, date }, ...this.state.history]
        });
    })
  }

  fetchData = () => {
    const { boardId } = this.props.match.params;

    fetch("/api/history/getByBoardId", {
      method: "POST",
      body: JSON.stringify({ id: boardId, skip: this.state.history.length, limit: HISTORY_ITEMS_PER_FETCH }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    }).then(res => {
      if (res.status === 200) {
        res.json().then(history => {
          if (history.length !== 0) {
            this.setState({
              history: [...this.state.history, ...history],
              isLoading: false
            });
          } else {
            this.setState({
              shouldFetch: false,
              isLoading: false
            });
          }
        });
      }
    });
  }

  trackScrolling = (e) => {
    if (this.state.shouldFetch && !this.state.isLoading) {
      const element = e.target;
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        this.setState({ isLoading: true });
        this.fetchData();
      }
    }
  }

  render() {
    const { history } = this.state;
    const { t } = this.props;
    const { boardUsersData } = this.props;
    return (
      <div id="history-list-container" onScroll={this.trackScrolling}>
        <p id="title">{t("History")}</p>
        <div id="history-container" >
          {history.map((historyItem, key) => (
            <div id="history-item" key={key}>
              <p>{(boardUsersData[historyItem.userId] || { name: "" }).name}</p>
              <p>{t(historyItem.action)}</p>
              {historyItem.date ? (<p>{(new Date(historyItem.date)).toLocaleDateString('en-GB')}</p>) : null}
            </div>
          ))}
        </div>
        {this.state.isLoading ?
          <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
            <Spinner />
          </Pane> : null}
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
