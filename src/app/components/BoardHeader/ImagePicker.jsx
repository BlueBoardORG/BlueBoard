import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import classnames from "classnames";
import FaCheck from "react-icons/lib/fa/check";
import { withTranslation } from "react-i18next";
import imageIcon from "../../../assets/images/image-icon.png";
import "./ColorPicker.scss";
import { BOARD_BG_URLS } from "../../../constants";
import ImageIcon from '@material-ui/icons/Image';

class ImagePicker extends Component {
  static propTypes = {
    boardId: PropTypes.string.isRequired,
    backgroundImage: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  };

  handleSelection = image => {
    const { dispatch, boardId, backgroundImage } = this.props;
    // Dispatch update only if selected color is not the same as current board color.
    if (image !== backgroundImage) {
      dispatch({ type: "CHANGE_BOARD_IMAGE", payload: { boardId, backgroundImage: image} });
    }
  };

  render() {
    const { backgroundImage,t } = this.props;
    return (
      <Wrapper
        className="color-picker-wrapper"
        onSelection={this.handleSelection}
      >
        <Button 
          className="color-picker" 
          data-tip={t("BoardHeaders.imagePicker")} 
          data-place="bottom"
        >
          <ImageIcon />
          {/* <div className="board-header-right-text">
            &nbsp;{t('Image')} &nbsp;&#9662;
          </div> */}
        </Button>
        <ReactTooltip/>
        <Menu className="color-picker-menu">
          {BOARD_BG_URLS.map(image => (
            <MenuItem
              value={image}
              className={classnames("color-picker-item", image)}
              key={image}
              style={{backgroundImage: `url(${image})`,backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}
            >
              {image === backgroundImage && <FaCheck />}
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
    backgroundImage: state.boardsById[boardId].backgroundImage,
    boardId
  };
};

export default withRouter(connect(mapStateToProps)(withTranslation()(ImagePicker)));
