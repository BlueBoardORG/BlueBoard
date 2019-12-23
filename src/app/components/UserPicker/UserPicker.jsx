import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Select from "react-select";

import "./UserPicker.scss";

class UserPicker extends Component {
  static propTypes = {
    toggleAssign: PropTypes.func.isRequired,
    cardId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { boardUsersData, assignedUserId } = this.props;
    const chosenUser = assignedUserId;


    this.state = {
      chosenUser
    };
  }

  componentDidMount() {
    const { boardUsersData, assignedUserId } = this.props;
    this.setState({ chosenUser:assignedUserId });
  }

  handleSave = () => {
    const { chosenUser } = this.state;
    const { dispatch, cardId, toggleAssign,assignedUserId } = this.props;
    let newAssignedUserId = [];

    if(Array.isArray(assignedUserId))
    {
      newAssignedUserId=assignedUserId;
      dispatch({
        type: "UPDATE_ASSIGNED_USER",
        payload: { cardId, assignedUserId: newAssignedUserId }
      });
    }
    else{
      newAssignedUserId.push(chosenUser);
      if(assignedUserId)
        newAssignedUserId.push(assignedUserId);
      dispatch({
        type: "UPDATE_ASSIGNED_USER",
        payload: { cardId, assignedUserId: newAssignedUserId }
      });     
    }

  };

  handleChange = newChosenUser => {
    const { chosenUser } = this.state;
    if(newChosenUser.value){
      console.log(newChosenUser.value);
      chosenUser.push(newChosenUser.value);
    }
    this.setState({ chosenUser });
  };

  render() {
    const { toggleAssign, boardUsersData, t,assignedUserId } = this.props;
    const { chosenUser } = this.state;

   /* const usersList = Object.values(boardUsersData).map(userData => (assignedUserId && assignedUserId.includes(userData._id))?
    ({

    }):
    ({
      value: userData._id,
      label: userData.name
    })
    );*/

    const usersList = Object.values(boardUsersData).filter(userData => {
      if (assignedUserId && assignedUserId.includes(userData._id)) {
        return false; // skip
      }
      return true;
    }).map(userData => { return {value: userData._id,label: userData.name} });
    console.log(assignedUserId);
    return (
      <div className="user-picker">
        <label>{t("Choose-User")}</label>
        <Select
          value={chosenUser}
          onChange={this.handleChange}
          options={[{ label: t("UserPicker.placeholder") }, ...usersList]}
          isSearchable={true}
          autoFocus={true}
          placeholder={t("UserPicker.placeholder")}
        />
        <div className="user-picker-buttons">
          <button onClick={this.handleSave} className="user-picker-save-button">
            {t("Save")}
          </button>
          <button onClick={toggleAssign}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { boardUsersData, cardsById } = state;
  const { assignedUserId } = cardsById[ownProps.cardId] || {};
  return { boardUsersData, assignedUserId };
};

export default connect(mapStateToProps)(withTranslation()(UserPicker));