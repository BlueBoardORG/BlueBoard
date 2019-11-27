import React from "react";
import { connect } from "react-redux";
import {
  Icon,
  Button,
  Popover,
  Pane,
  Text,
  Position,
  Table,
  Pill
} from "evergreen-ui";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import socket from "../../socketIOHandler";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    };
    socket.on("notification", newNotification => {
      this.addNewNotification(newNotification);
      //add state for changing logo to updates
    });
  }

  fetchNotificationsFromDB() {
    fetch("/api/notifications/getByUserId", {
      method: "POST",
      body: JSON.stringify({ id: this.props.userId }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    }).then(response => {
      if (response) {
        if (response.status === 200) {
          response.json().then(jsonData => {
            this.setState({ notifications: jsonData.reverse() });
          });
        }
      }
    });
  }

  addNewNotification(newNotification) {
    let currentNotifications = this.state.notifications;
    this.setState({
      notifications: [newNotification, ...currentNotifications]
    });
  }

  componentDidMount() {
    this.fetchNotificationsFromDB();

    const cardsById = this.props.cardsById;
  }

  goToBoard(notification) {
    this.wasSeenHandler(notification);
    const { history } = this.props;
    history.push(`/b/${notification.boardId}`);
  }

  wasSeenHandler(notification) {
    const { _id } = notification;
    fetch("/api/notifications/changeWasSeen", {
      method: "POST",
      body: JSON.stringify({ _id }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    }).then(response => {
      if (response) {
        if (response.status === 200) {
          this.fetchNotificationsFromDB();
        }
      }
    });
  }



  notificationMessage(notification) {
    const { t } = this.props;
    return `${notification.from} ${t(notification.action)}`;
  }

  deleteHandler(notification) {
    const notificationsWithRemovedNotification = [
      ...this.state.notifications
    ].filter(item => item._id !== notification._id);
    this.setState({ notifications: notificationsWithRemovedNotification });
    fetch("/api//notifications/", {
      method: "DELETE",
      body: JSON.stringify({ _id: notification._id }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    }).then(response => {
      if (response) {
        if (response.status === 200) {
          //success
        }
      }
    });
  }

  render() {
    const styles = {
      container: {
        display: "flex",
        alignItems: "center",
        padding: 4,
        background: "transparent",
        border: "none",
        outline: "none"
      },
      text: {
        display: "flex",
        background: "transparent",
        border: "none",
        outline: "none"
      },
      icon: {
        height: "25px"
      }
    };

    let numOfUnSeenNotifs = this.state.notifications.filter(item => !item.wasSeen).length;

    return (
      <div style={styles.container}>
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Table width={400} height={480}>
              <Table.VirtualBody
                style={{ direction: "ltr" }}
                width={400}
                height={480}
              >
                {this.state.notifications
                  ? this.state.notifications.map(notification => {
                    if (!notification) return;

                    return (
                      <Table.Row
                        style={{ direction: "rtl" }}
                        key={notification._id}
                        isSelectable
                      >
                        <Table.TextCell
                          onClick={() => this.goToBoard(notification)}
                        >
                          <Table.Cell>
                            {notification.wasSeen ? <FontAwesomeIcon icon={faEye} /> : null}
                          </Table.Cell>
                        </Table.TextCell>

                        <Table.TextCell
                          style={{ direction: "rtl" }}
                          onClick={() => this.goToBoard(notification)}
                          flexBasis={240}
                          flexShrink={0}
                          flexGrow={0}
                        >
                          {this.notificationMessage(notification)}
                        </Table.TextCell>
                        <Table.Cell>
                          <Button
                            onClick={() => this.deleteHandler(notification)}
                            isActive={false}
                            appearance="minimal"
                          >
                            <Icon
                              appearance="minimal"
                              height={40}
                              icon="trash"
                              color="danger"
                            />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                  : null}
              </Table.VirtualBody>
            </Table>
          }
        >
          <Button isActive={false} appearance="minimal" height={40}>
            {numOfUnSeenNotifs > 0 ? (
              <Pill color="red" isSolid>
                {numOfUnSeenNotifs}
              </Pill>
            ) : null}
            <Icon
              appearance="minimal"
              height={40}
              icon="notifications"
              color="#ffffff"
            />
          </Button>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, boardsById } = state;
  return {
    userId: user ? user._id : "guest",
    userName: user.name,
    boardsById
  };
};


export default withRouter(
  connect(mapStateToProps)(withTranslation()(Notification))
);
