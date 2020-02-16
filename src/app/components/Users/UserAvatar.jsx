import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import { loadBoardUsersData } from "../../actions/boardActions";
import { ADMIN_ROLE } from "../../../constants";
import "./UsersList.scss";
import { getColorFromString } from '../../helpers/colorFromString';

const COLORS = ["red", "orange", "green", "blue", "purple", "black"];

class UserAvatar extends Component {
  handleSelection = action => {
    const { t } = this.props;
    if (action === t("UserAvatar.menu.kick")) {
      return this.deleteUser();
    }

  };

  deleteUser = () => {
    const { dispatch, user, currentBoardId, boardUsers } = this.props;

    dispatch({
      type: "REMOVE_USER",
      payload: { boardId: currentBoardId, userIdToRemove: user._id }
    });

    const newUserIds = new Set([
      ...(boardUsers || [])
        .map(curUser => curUser.id)
        .filter(userId => userId !== user._id)
    ]);

    loadBoardUsersData(dispatch, Array.from(newUserIds));
  };

  hashCode = (str) => { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToRGB = (i) => {
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  render() {
    const { user, t, isCurrentUserAdmin, currentUser, boardUsers } = this.props;

    const words = user.name.split(" ");
    const color = getColorFromString(user.name || "")

    const deleteButton = (
      <div>
        <div className="board-leave-header">{t("UserAvatar.menu.title")}</div>
        <MenuItem className="board-leave-confirm">{t("UserAvatar.menu.kick")}</MenuItem>
      </div>
    );
    let avatarToolTip = user.name;
    const userRole = (
      boardUsers.find(currUser => currUser.id === user._id) || {}
    ).role;
    // Adding the user's role to the tooltip
    avatarToolTip += ` (${t(`UserAvatar.role.${userRole}`)})`;

    return (
      <div>
        <Wrapper
          className="board-leave-wrapper"
          onSelection={this.handleSelection}
        >
          <Button>
            <span className="dot" style={{ backgroundColor: color }} data-tip={avatarToolTip}>
              {words[0][0]}
              {words.length > 1 && words[words.length - 1][0]}
            </span>
          </Button>

          <ReactTooltip />

          <Menu className="board-leave-menu">
            {isCurrentUserAdmin && currentUser._id !== user._id && deleteButton}
          </Menu>
        </Wrapper>
      </div>
    );
  }
}

export default connect()(withTranslation()(UserAvatar));
