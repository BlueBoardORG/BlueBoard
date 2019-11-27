import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import AsyncSelect from "react-select/lib/Async";
import Select from "react-select";
import { loadBoardUsersData } from "../../actions/boardActions";
import {
  ADMIN_ROLE,
  READ_WRITE_ROLE,
  READ_ROLE,
  DEFAULT_ROLE
} from "../../../constants";

class UserAdder extends Component {
  state = { selectedUserId: null, selectedRole: null };

  addUser = () => {
    const { dispatch, boardId, users, toggleModal } = this.props;
    const { selectedUserId, selectedRole } = this.state;

    // Verify that the user picked a user
    if (!selectedUserId) return;


    dispatch({
      type: "ADD_USER",
      payload: {
        boardId,
        userToAdd: { id: selectedUserId, role: selectedRole || DEFAULT_ROLE, watch: "Not watching" }
      }
    });
    const newUserIds = new Set([...users.map(user => user.id), selectedUserId]);

    loadBoardUsersData(dispatch, Array.from(newUserIds));
    toggleModal();
  };

  searchUsers = inputValue => {
    if (!inputValue.trim()) {
      return;
    }

    return new Promise((resolve, reject) => {
      fetch("/api/userRegex", {
        method: "POST",
        body: JSON.stringify({ userSearchField: inputValue }),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }).then(response => {
        if (response && response.status === 200) {
          response.json().then(jsonData => {
            resolve(jsonData);
          });
        } else {
          reject();
        }
      });
    }).catch(() => reject());
  };

  handleChange = ({ value }) => {
    this.setState({ selectedUserId: value });
  };

  handleRoleChange = ({ value }) => {
    this.setState({ selectedRole: value });
  };

  getRoleOptions = () => {
    const { t } = this.props;
    const roles = [ADMIN_ROLE, READ_WRITE_ROLE, READ_ROLE];
    return roles.map(role => ({
      value: role,
      label: t("UserAvatar.role." + role)
    }));
  };

  getDefaultRole = () => {
    const { t } = this.props;
    return { value: DEFAULT_ROLE, label: t("UserAvatar.role." + DEFAULT_ROLE) };
  };

  render() {
    const { toggleModal, t } = this.props;

    return (
      <div>
        <span>{t("UserPicker.label.select_user")}</span>
        <AsyncSelect
          onChange={this.handleChange}
          isSearchable={true}
          autoFocus={true}
          loadOptions={this.searchUsers}
          placeholder={t("UserAdder.search_place_holder")}
        />
        <span>{t("UserPicker.label.select_role")}</span>
        <Select
          defaultValue={this.getDefaultRole()}
          onChange={this.handleRoleChange}
          options={this.getRoleOptions()}
          isSearchable={false}
          autoFocus={false}
        />
        <div className="user-picker-buttons">
          <button className="user-picker-save-button" onClick={this.addUser}>
            {t("Save")}
          </button>
          <button onClick={toggleModal}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { currentBoardId } = state;

  return {
    boardId: currentBoardId,
    users: state.boardsById[currentBoardId].users
  };
};

export default connect(mapStateToProps)(withTranslation()(UserAdder));
