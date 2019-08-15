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
  constructor() {
    super();
    this.state = {
        labelColor: null
    };
}

  handleSelection = color => {
    const { dispatch, boardId, label } = this.props;
    if (color !== label.color || color !== this.state.labelColor) {
      dispatch({  type: "Edit_LABEL", payload: { boardId, editedLabel: { id: label.id,  title: null,  color }}});
      this.setState({labelColor: color});
    }
  };


  render() {
    const {label,t} = this.props;
    const colors = ["Purple","violet","PaleVioletRed","RoyalBlue", "Turquoise","SpringGreen", "yellowgreen", "Gold" ,"Orange","Red","tomato","gray"];
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
        <Menu className="menu-color-picker">
          {colors.map(color => (
            <MenuItem
              value={color}
              className={classnames("color-picker-item", color)}
              key={color}
            >
              {this.state.labelColor ? color === this.state.labelColor && <FaCheck/> :color ===  label.color && <FaCheck/>}
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
