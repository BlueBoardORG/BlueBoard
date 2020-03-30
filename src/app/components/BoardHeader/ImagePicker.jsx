import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import classnames from "classnames";
import FaCheck from "react-icons/lib/fa/check";
import { withTranslation } from "react-i18next";
import "./ImagePicker.scss";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import ButtonUI from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { BOARD_BG_URLS } from "../../../constants";
import ImageIcon from '@material-ui/icons/Image';

class ImagePicker extends Component {

  static propTypes = {
    boardId: PropTypes.string.isRequired,
    backgroundImage: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isDialogOpen: false,
    }
  }

  handleDialogClose = () => {
    this.setState({ isDialogOpen: false });
  }

  handleDialogOpen = () => {
    this.setState({ isDialogOpen: true });
  }

  handleSelection = image => {
    const { dispatch, boardId, backgroundImage } = this.props;
    // Dispatch update only if selected color is not the same as current board color.
    if (image !== backgroundImage) {
      dispatch({ type: "CHANGE_BOARD_IMAGE", payload: { boardId, backgroundImage: image } });
    }
  };

  render() {
    const { backgroundImage, t } = this.props;
    return (
      <Wrapper
        className="color-picker-wrapper"
        onSelection={this.handleSelection}
      >
        <Button
          className="color-picker"
          data-tip={t("BoardHeaders.imagePicker")}
          data-place="bottom"
          onClick={this.handleDialogOpen}
        >
          <ImageIcon />
          {/* <div className="board-header-right-text">
            &nbsp;{t('Image')} &nbsp;&#9662;
          </div> */}
        </Button>
        <ReactTooltip />
        {/* <Menu className="color-picker-menu">
          {BOARD_BG_URLS.map(image => (
            <MenuItem
              value={image}
              className={classnames("color-picker-item", image)}
              key={image}
              style={{ backgroundImage: `url(${image})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
            >
              {image === backgroundImage && <FaCheck />}
            </MenuItem>
          ))}
        </Menu> */}

        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.handleDialogClose}
        >
          <DialogTitle id="alert-dialog-title">{t("imagePicker.choose")}</DialogTitle>
          <DialogContent>
            <div id="image-container">
              {BOARD_BG_URLS.map(image => (
                <MenuItem
                  value={image}
                  className={classnames("image-picker-item", image)}
                  key={image}
                  style={{ backgroundImage: `url(${image})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
                >
                  {image === backgroundImage && <FaCheck />}
                </MenuItem>
              ))}
            </div>

          </DialogContent>
          <DialogActions>
            <ButtonUI onClick={this.handleDialogClose} color="primary" autoFocus>
              {t("Close")}
            </ButtonUI>
          </DialogActions>
        </Dialog>
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
