import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Modal from "react-modal";
import { connect } from "react-redux";
import { ADMIN_ROLE } from "../../../constants";
import UserAdder from "./UserAdder";
import UserAvatar from "./UserAvatar";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "./UsersList.scss";
import AddIcon from '@material-ui/icons/Add';

class UsersList extends Component {
  static propTypes = {
    users: PropTypes.object.isRequired
  };
  state = { isModalOpen: false };

  isCurrentUserAdmin = () => {
    const { boardUsers, user } = this.props;
    const currentUserBoardData = boardUsers.find(
      curUser => curUser.id === user._id
    );
    return (currentUserBoardData || {}).role === ADMIN_ROLE;
  };

  _usersNames = () => {
    const { users, currentBoardId, boardUsers, user } = this.props;
    const currentUser = user;
    const isCurrentUserAdmin = this.isCurrentUserAdmin();

    return Object.values(users).map((user, i) => {
      return (
        <UserAvatar
          user={user}
          currentBoardId={currentBoardId}
          boardUsers={boardUsers}
          isCurrentUserAdmin={isCurrentUserAdmin}
          currentUser={currentUser}
          key={i}
        />
      );
    });
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    const { t } = this.props;
    const { isModalOpen } = this.state;
    const window = window;
    const modalStyle = {
      content: {
        background: "white",
        padding: 5,
        borderRadius: 4
      }
    };

    return (
      <ExpansionPanel id="users-tree">
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{t("UsersList.title")}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            <div className="user-list-wrapper" style={{ background: "transpernt" }}>
              <div className="name-holder">
                {this._usersNames()}
                {this.isCurrentUserAdmin() && (
                  <div>
                    <span
                      onClick={this.toggleModal}
                      data-tip={t("UsersList.add_user_tip")}
                      className="dot add-user"
                    >
                      <AddIcon />
                    </span>
                  </div>
                )}
              </div>

              <Modal
                isOpen={isModalOpen}
                onRequestClose={this.toggleModal}
                overlayClassName="modal-underlay"
                className="user-add-modal"
                style={modalStyle}
              >
                <UserAdder toggleModal={this.toggleModal} />
              </Modal>
            </div>
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    users: state.boardUsersData,
    currentBoardId: state.currentBoardId,
    boardUsers: (state.boardsById[state.currentBoardId] || {}).users || []
  };
};

export default connect(mapStateToProps)(withTranslation()(UsersList));
