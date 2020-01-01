import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
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
    const { chosenUser,assignedUser } = this.state;
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
      if(!isExist){
        newAssignedUserId.push(chosenUser.value);
        this.setState({
          assignedUser:newAssignedUserId
        });
        dispatch({
          type: "UPDATE_ASSIGNED_USER",
          payload: { cardId, assignedUserId: newAssignedUserId }
        });
      }
      
    }
    else if(chosenUser.value !== assignedUserId ){
      newAssignedUserId.push(chosenUser.value);
      if(assignedUserId){
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
    if(Array.isArray(assignedUser)){
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
    else{
      this.setState({
        assignedUser:[]
      });
      dispatch({
        type: "UPDATE_ASSIGNED_USER",
        payload: { cardId, assignedUserId: [] }
      });
    }
  }

  intToRGB = (i) => {
    let c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
  }

  hashCode = (str) => { // java String#hashCode
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  } 
  
  showUsers = () => {
    const {assignedUser} = this.state;
    const {boardUsersData,t} = this.props;

    const usersList = Object.values(boardUsersData).filter(userData => {
      if(!Array.isArray(assignedUser) && assignedUser === userData._id){
        return true; // skip
      }
      else if (Array.isArray(assignedUser) && assignedUser && assignedUser.includes(userData._id)) {
        return true; // skip
      }
      return false;
    }).map(userData => { return {value: userData._id,label: userData.name} });
    
    if(Array.isArray(assignedUser)){
      return(
        <div>
        {usersList.map((item) =>(

          <button className="user-avatar" data-tip={t("assigned.user.delete")}  style={{ background: "#" + this.intToRGB(this.hashCode(item.value))}} key={item.value} value={item.value} onClick={this.deleteUser} >
            {item.label.split(" ")[0][0]}
            {item.label.split(" ").length > 1 && item.label.split(" ")[item.label.split(" ").length - 1][0]}
            <ReactTooltip/>
          </button>
          
        ))}
        </div>
      );
    }
    else if(usersList[0]){
      return(
        <button className="user-avatar" data-tip={t("assigned.user.delete")}  style={{ background: "#" + this.intToRGB(this.hashCode(usersList[0].value))}} key={usersList[0].value} value={usersList[0].value} onClick={this.deleteUser} >
          {usersList[0].label.split(" ")[0][0]}
          {usersList[0].label.split(" ").length > 1 && usersList[0].label.split(" ")[usersList[0].label.split(" ").length - 1][0]}
          <ReactTooltip/>
        </button>
      );
    }
    
    
  }

  render() {
    const { toggleAssign, boardUsersData, t } = this.props;
    const { chosenUser,assignedUser } = this.state;
    const usersList = Object.values(boardUsersData).filter(userData => {
      if(!Array.isArray(assignedUser) && assignedUser === userData._id){
        return false; // skip
      }
      else if (Array.isArray(assignedUser) && assignedUser && assignedUser.includes(userData._id)) {
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