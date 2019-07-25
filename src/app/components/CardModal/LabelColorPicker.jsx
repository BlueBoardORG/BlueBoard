import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import classnames from "classnames";
import FaCheck from "react-icons/lib/fa/check";
import colorIcon from "../../../assets/images/color-icon.png";
import "./LabelColorPicker.scss";
import { withTranslation } from "react-i18next";

class LabelColorPicker extends Component {
  static propTypes = {
    label: PropTypes.object.isRequired,
    boardId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  handleSelection = color => {
    const { dispatch, boardId, label } = this.props;
    if (color !== label.color) {
      dispatch({  type: "Edit_LABEL", payload: { boardId, editedLabel: { id: label.id,  title: null,  color }}});
    }
  };


  render() {
    const {label,t} = this.props;
    const colors = ["violet", "Turquoise", "yellowgreen", "Gold" ,"Orange","tomato"];
    return (
      <Wrapper
        className="color-picker-wrapper"
        onSelection={this.handleSelection}
      >
        <Button className="color-picker">
          <img src={colorIcon} alt="colorwheel" className="modal-icon" />
          <div style={{color:"black"}} className="board-header-right-text">
            &nbsp;{t('Color')} &nbsp;&#9662;
          </div>
        </Button>
        <Menu className="color-picker-menu">
          {colors.map(color => (
            <MenuItem
              value={color}
              className={classnames("color-picker-item", color)}
              key={color}
            >
              {color ===  label.color && <FaCheck/>}
            </MenuItem>
          ))}
        </Menu>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { boardId } = ownProps.match.params;
  return {
    boardId
  };
};

export default withRouter(connect(mapStateToProps)(withTranslation()(LabelColorPicker)));
