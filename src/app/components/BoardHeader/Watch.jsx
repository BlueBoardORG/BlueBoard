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
import classes from "./Watch.scss";

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

  render() {
    const watchModes = ["Watching", "Not watching", "Ignoring"];
    const {currentWatchMode} = this.props;

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
            <Table>
              {watchModes.map(watchMode => {
                return (
                  <Table.Row
                    background={
                      watchMode === currentWatchMode ? "#C7CED4" : "#ffffff"
                    }
                    
                    key={watchMode}
                    isSelectable
                    onSelect={() => this.handleSelection(watchMode)}
                  >
                    <Table.TextCell>{watchMode}</Table.TextCell>
                  </Table.Row>
                );
              })}
            </Table>
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
