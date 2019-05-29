import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Modal from "react-modal";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { ADMIN_ROLE } from "../../../constants";
import UserAdder from "./UserAdder";
import "./Group.scss";

class Group extends Component {
  static propTypes = {
    users: PropTypes.object.isRequired
  };
  state = { isModalOpen: false };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    const { t } = this.props;
    const window = window;
    const { isModalOpen } = this.state;
    const modalStyle = {
      content: {
        background: "white",
        padding: 5,
        borderRadius: 4,
        height: "300px"
      }
    };

    return (
        <div>
            <h4 onClick={this.toggleModal}>{t("Group.create")}</h4>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={this.toggleModal}
              overlayClassName="modal-underlay"
              className="user-add-modal"
              style={modalStyle}
            >
            <UserAdder toggleModal={this.toggleModal} isGroup={true}/>
            </Modal>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    users: state.boardUsersData,
    currentBoardId: state.currentBoardId,
    boardUsers: (state.boardsById[state.currentBoardId] || {}).users || []
  };
};

export default connect(mapStateToProps)(withTranslation()(Group));
