import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import classnames from "classnames";
import FaCheck from "react-icons/lib/fa/check";
import "./ColorPicker.scss";
import { withTranslation } from "react-i18next";
import ColorLensIcon from '@material-ui/icons/ColorLens';

class ColorPicker extends Component {
  static propTypes = {
    boardId: PropTypes.string.isRequired,
    boardColor: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  handleSelection = color => {
    const { dispatch, boardId, boardColor } = this.props;
    // Dispatch update only if selected color is not the same as current board color.
    if (color !== boardColor) {
      dispatch({ type: "CHANGE_BOARD_COLOR", payload: { boardId, color } });
    }
  };

  render() {
    const { boardColor,t } = this.props;
    const colors = ["blue", "green", "red", "pink"];
    return (
      <Wrapper
        className="color-picker-wrapper"
        onSelection={this.handleSelection}
      >
        <Button 
          className="color-picker" 
          data-tip={t("BoardHeaders.colorPicker")} 
          data-place="bottom"
        >
          <ColorLensIcon />
          {/* <div className="board-header-right-text">
            &nbsp;{t('Color')} &nbsp;&#9662;
          </div> */}
        </Button>
        <ReactTooltip/>
        <Menu className="color-picker-menu">
          {colors.map(color => (
            <MenuItem
              value={color}
              className={classnames("color-picker-item", color)}
              key={color}
            >
              {color === boardColor && <FaCheck />}
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
    boardColor: state.boardsById[boardId].color,
    boardId
  };
};

export default withRouter(connect(mapStateToProps)(withTranslation()(ColorPicker)));
