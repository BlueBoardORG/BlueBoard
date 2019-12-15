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
    let chosenUser = {};
    if (boardUsersData[assignedUserId]) {
      chosenUser = {
        value: boardUsersData[assignedUserId]._id,
        label: boardUsersData[assignedUserId].name
      };
    }

    this.state = {
      chosenUser
    };
  }

  componentDidMount() {
    const { boardUsersData, assignedUserId } = this.props;
    let chosenUser = {};
    if (boardUsersData[assignedUserId]) {
      chosenUser = {
        value: boardUsersData[assignedUserId]._id,
        label: boardUsersData[assignedUserId].name
      };
    }
    this.setState({ chosenUser });
  }

  handleSave = () => {
    const { chosenUser } = this.state;
    const { dispatch, cardId, toggleAssign,assignedUserId } = this.props;
    let newAssignedUserId = [];
    let isExist = false;

    if(Array.isArray(assignedUserId))
    {
      newAssignedUserId=assignedUserId;
      for(let i=0; i<= assignedUserId.length ;i++){
        if(newAssignedUserId[i] === chosenUser.value){
          newAssignedUserId.splice(i, 1);
          isExist = true;
        }
      }
      if(!isExist)
        newAssignedUserId.push(chosenUser.value);
      
      dispatch({
        type: "UPDATE_ASSIGNED_USER",
        payload: { cardId, assignedUserId: newAssignedUserId }
      });
    }
    else{
      if(chosenUser.value !== assignedUserId ){
        newAssignedUserId.push(chosenUser.value);
        if(assignedUserId)
          newAssignedUserId.push(assignedUserId);
      }
      dispatch({
        type: "UPDATE_ASSIGNED_USER",
        payload: { cardId, assignedUserId: newAssignedUserId }
      });     
    }

  };

  handleChange = chosenUser => {
    this.setState({ chosenUser });
  };

  render() {
    const { toggleAssign, boardUsersData, t } = this.props;
    const { chosenUser } = this.state;
    const usersList = Object.values(boardUsersData).map(userData => ({
      value: userData._id,
      label: userData.name
    }));

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