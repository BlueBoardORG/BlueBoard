import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Icon,
  Popover,
  Pane,
  Text,
  Button,
  Position,
  Table,
  Pill
} from "evergreen-ui";
import "./Watch.scss";

class Watch extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    boardId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    currentWatchMode: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSelection = newWatchMode => {
    const { dispatch, boardId, userId } = this.props;
    console.log("The new watch mode: ");
    console.log(newWatchMode);
    // Dispatch update only if selected color is not the same as current board color.
    if (newWatchMode !== this.props.currentWatchMode) {
      dispatch({
        type: "CHANGE_USER_WATCH",
        payload: { boardId, userId, newWatchMode }
      });
    }
  };

  addVIcon(watchMode) {
    const {currentWatchMode} = this.props;
    return (watchMode === currentWatchMode ? <Icon icon="tick-circle" color="success" marginRight={0} /> : null)
  }

  makeWatchDiv(mode, description){
    return (
      <div>
        <span className="div-heading">{mode}</span>
        <span className="div-description">{description}</span>
      </div>
    );
  }

  render() {
    const watchModes = [
      {
        mode: "Watching",
        description: "Be notified of all conversations"
      },
      {
        mode: "Not watching",
        description: "Be notified only when assign "
      },
      {
        mode: "Ignoring",
        description: "Never be notified"
      }
  ];

    const styles = {
      container: {
        display: "flex",
        alignItems: "center",
        padding: 4,
        background: "transparent",
        border: "none",
        outline: "none"
      },
      text: {
        display: "flex",
        background: "transparent",
        border: "none",
        outline: "none"
      },
      icon: {
        height: "25px"
      }
    };

    return (
      <div style={styles.container}>
        <Popover
          content={
            <Pane width={300}>
              {watchModes.map((watchMode, index) => {
                return (
                  <Table.Row
                    height={60} 
                    paddingY={12}
                    key={index}
                    isSelectable
                    onSelect={() => this.handleSelection(watchMode.mode)}
                  >
                    <Table.TextCell className="text-wrapper">{this.makeWatchDiv(watchMode.mode, watchMode.description)}</Table.TextCell>
                    <Table.Cell className="v-icon-wrapper" flex="none">{this.addVIcon(watchMode.mode)}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Pane>
          }
        >
          <Button isActive={false} appearance="minimal" height={40}>
            <Icon
              appearance="minimal"
              height={40}
              icon="eye-open"
              color="#ffffff"
            />
          </Button>
        </Popover>
      </div>
    );

  }
}

const mapStateToProps = (state, ownProps) => {
  const { boardId } = ownProps.match.params;
  const { user } = state;
  return {
    boardId,
    userId: user._id,
    currentWatchMode: state.boardsById[boardId].users.find(
      boardUser => boardUser.id === user._id
    ).watch
  };
};

export default withRouter(connect(mapStateToProps)(withTranslation()(Watch)));
