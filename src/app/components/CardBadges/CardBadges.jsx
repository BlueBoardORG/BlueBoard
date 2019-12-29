import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import format from "date-fns/format";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import MdAlarm from "react-icons/lib/md/access-alarm";
import MdLabel from "react-icons/lib/md/label";
import MdDoneAll from "react-icons/lib/fa/check-square-o";
import FaUser from "react-icons/lib/fa/user";
import "./CardBadges.scss";
import { withTranslation } from "react-i18next";
import { colorsWithLabels } from "../utils";

class CardBadges extends Component {
  static propTypes = {
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    checkboxes: PropTypes.shape({
      total: PropTypes.number.isRequired,
      checked: PropTypes.number.isRequired
    }).isRequired,
    assignedUserName: PropTypes.array,
    assignedUserId: PropTypes.array,
    boardUsersData: PropTypes.object,
    labels: PropTypes.array,
    boardId: PropTypes.string.isRequired,
    cardId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  constructor() {
    super();
  }

  renderDueDate = () => {
    const { date } = this.props;
    if (!date) {
      return null;
    }
    const dueDateFromToday = differenceInCalendarDays(date, new Date());

    let dueDateString;
    if (dueDateFromToday < -1) {
      dueDateString = `${Math.abs(dueDateFromToday)} days ago`;
    } else if (dueDateFromToday === -1) {
      dueDateString = "Yesterday";
    } else if (dueDateFromToday === 0) {
      dueDateString = "Today";
    } else if (dueDateFromToday === 1) {
      dueDateString = "Tomorrow";
    } else {
      dueDateString = format(date, "D MMM");
    }

    let dueDateColor;
    if (dueDateFromToday < 0) {
      dueDateColor = "red";
    } else if (dueDateFromToday === 0) {
      dueDateColor = "#d60";
    } else {
      dueDateColor = "green";
    }

    return (
      <div className="badge" style={{ background: dueDateColor }}>
        <MdAlarm className="badge-icon" />
        &nbsp;
        {dueDateString}
      </div>
    );
  };

  // Render badge showing amoung of checkboxes that are checked
  renderTaskProgress = () => {
    const { total, checked } = this.props.checkboxes;
    if (total === 0) {
      return null;
    }
    return (
      <div
        className="badge"
        style={{ background: checked === total ? "green" : "#444" }}
      >
        <MdDoneAll className="badge-icon" />
        &nbsp;
        {checked}/{total}
      </div>
    );
  };

  hashCode = (str) => { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToRGB = (i) => {
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }
  /**
   * return labels.map((label) => (
      <div key={label}>
        {this.getLabelById(label)
          ? <div
            className="badge"
            style={{ background: this.getLabelById(label).color }}
          >
            <MdLabel className="badge-icon" />
            &nbsp;
        {this.getLabelById(label).title}
          </div>
          : null
        }
   */

  renderAssigned = () => {
    const { assignedUserId } = this.props;
    if(Array.isArray(assignedUserId) && assignedUserId.length > 0 ){
      return assignedUserId.map((item) => (
        <div key={item._id}>
            <div
            className="badge"
            style={{ background: "#" + this.intToRGB(this.hashCode(item._id))}}
          >
            <FaUser className="badge-icon" />
            &nbsp;
            {item.name}
          </div>
        </div>
      ));
    }   

  };
  onWheelLabels = e => {
    const { currentTarget, deltaY } = e;
    if (currentTarget.className === "scroll-wrapper") {
      currentTarget.scrollTo(currentTarget.scrollLeft + deltaY, 0);
      e.preventDefault();
    }
  };
  deleteLabel=(labelId) => {
    const { dispatch, cardId } = this.props;
    dispatch({
      type: "DELETE_LABEL",
      payload: { label: labelId,  cardId }
    });
  }

  getLabelById = (labelId) => {
    let labelvalue;
    this.props.boardLabels.map(label => {
      if (labelId === label.id) {
        labelvalue = label;
      }
    });
    if (labelvalue === undefined) {
      this.deleteLabel(labelId);
      return null;
    }
    return labelvalue;
  }

  renderLabels = () => {
    const { labels } = this.props;
    if (!labels) {
      return null;
    }

    return labels.map((label) => (
      <div key={label}>
        {this.getLabelById(label)
          ? <div
            className="badge"
            style={{ background: this.getLabelById(label).color }}
          >
            <MdLabel className="badge-icon" />
            &nbsp;
        {this.getLabelById(label).title}
          </div>
          : null
        }
      </div>
    ));
  };

 

  render() {
    return (
      <div
        id="scroll-wrapper"
        className="scroll-wrapper"
        onWheel={this.onWheelLabels}
      >
        <div className="card-badges">
          {this.renderDueDate()}
          {this.renderTaskProgress()}
          {this.renderAssigned()}
          {this.renderLabels()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const boardLabels = state.boardsById[ownProps.boardId].labels;
  const { boardUsersData } = state;
  return {boardLabels,boardUsersData};
};

export default connect(mapStateToProps)(withTranslation()(CardBadges));