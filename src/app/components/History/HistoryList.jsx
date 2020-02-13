import React, { Component, Fragment } from "react";
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
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
            })
            setTimeout(() => {
              const { scrollHeight: historyContainerScrollHeight, clientHeight: historyContainerClientHeight } = document.getElementById('history-list-container');
              if (historyContainerScrollHeight - historyContainerClientHeight === 0) {
                this.fetchData();
              }
            }, 100);

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

      if (element.scrollHeight - element.scrollTop === element.offsetHeight) {
        this.setState({ isLoading: true });
        this.fetchData();
      }
    }
  }

  displayDate = (historyDate) => {
    if (!historyDate)
      return (<p />);

    const lessThanTen = n => (n < 10) ? ((0).toString() + n) : n;
    const date = new Date(historyDate);
    const time = `${lessThanTen(date.getHours())}:${lessThanTen(date.getMinutes())}`;

    return (
      <div style={{ textAlign: 'center', width: 'min-content' }}>
        <p>{`${date.toLocaleDateString('en-GB')}\r\n${time}`}</p>
      </div>
    );
  }

  render() {
    const { history } = this.state;
    const { t } = this.props;
    const { boardUsersData } = this.props;
    return (
      <Fragment>
        <List component="nav" aria-label="main mailbox folders" subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {t("History")}
          </ListSubheader>
        }>

          <div id="history-list-container" onScroll={this.trackScrolling}>
            <div id="history-container" >
              {history.map((historyItem, key) => (
                <ListItem button>
                  <div id="history-item" key={key}>
                    <p>{(boardUsersData[historyItem.userId] || { name: "" }).name}</p>
                    <p>{t(historyItem.action)}</p>
                    {this.displayDate(historyItem.date)}
                  </div>

                </ListItem>
              ))}
            </div>
            {
              this.state.isLoading ?
                <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
                  <Spinner />
                </Pane> : null
            }
          </div>
        </List>
      </Fragment>
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
