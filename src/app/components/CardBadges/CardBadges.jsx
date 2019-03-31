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
    assignedToMe: PropTypes.bool,
    assignedUserName: PropTypes.string,
    assignedUserId: PropTypes.string,
    labels: PropTypes.array
  };

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

  renderAssigned = () => {
    const {assignedUserName , assignedUserId} = this.props;

    if (!assignedUserName) {
      return null;
    }

    return (
      <div
        className="badge"
        style={{ background: "#" + this.intToRGB(this.hashCode(assignedUserId)) }}
      >
        <FaUser className="badge-icon" />
        &nbsp;
        {assignedUserName}
      </div>
    );
  };

  renderLabels = () => {
    const { labels, t } = this.props;
    const colorsWithLabelsMap = new Map(colorsWithLabels);

    if (!labels) {
      return null;
    }

    return labels.map(label => (
      <div
        key={label}
        className="badge"
        style={{ background: colorsWithLabelsMap.get(label) }}
      >
        <MdLabel className="badge-icon" />
        &nbsp;
        {t(`Labels.${label}`)}
      </div>
    ));
  };

  onWheelLabels = e => {
    const { currentTarget, deltaY } = e;
    if (currentTarget.className === "scroll-wrapper") {
      currentTarget.scrollTo(currentTarget.scrollLeft + deltaY, 0);
      e.preventDefault();
    }
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

export default connect()(withTranslation()(CardBadges));
