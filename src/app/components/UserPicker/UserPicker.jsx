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
      chosenUser,
      assignedUser:assignedUserId
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
          isExist = true;
        }
      }
      if(!isExist)
        newAssignedUserId.push(chosenUser.value);
        this.setState({
          assignedUser:newAssignedUserId
        });
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
      this.setState({
        assignedUser:newAssignedUserId
      });
      dispatch({
        type: "UPDATE_ASSIGNED_USER",
        payload: { cardId, assignedUserId: newAssignedUserId }
      });     
    }

  };

  handleChange = chosenUser => {
    this.setState({ chosenUser });
  };

  deleteUser = event => {
    const {dispatch,cardId} = this.props;
    const {assignedUser} = this.state;
    for(let i=0;i<assignedUser.length;i++){
      if(assignedUser[i] === event.target.value){
        assignedUser.splice(i, 1);
      }
    }
    this.setState({
      assignedUser
    });
    dispatch({
      type: "UPDATE_ASSIGNED_USER",
      payload: { cardId, assignedUserId: assignedUser }
    });
  }
  
  showUsers = () => {
    const {assignedUser} = this.state;
    if(Array.isArray(assignedUser)){
      return assignedUser.map((item) => (
        <button key={item} value={item} onClick={this.deleteUser} >
          {item}
        </button>
      ));
    }
  }

  render() {
    const { toggleAssign, boardUsersData, t } = this.props;
    const { chosenUser,assignedUser } = this.state;
    const usersList = Object.values(boardUsersData).filter(userData => {
      if (assignedUser && assignedUser.includes(userData._id)) {
        return false; // skip
      }
      return true;
    }).map(userData => { return {value: userData._id,label: userData.name} });

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
        {this.showUsers()}
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