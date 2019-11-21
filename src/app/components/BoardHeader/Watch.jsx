import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Icon,
  Popover,
  Pane,
  Button,
  Table,
} from "evergreen-ui";
import "./Watch.scss";


const convertTitleToMode = (modeTitle) => {
  switch (modeTitle) {
    case "Watch.mode.watching.title":
      return "Watching";
    case "Watch.mode.not_watching.title":
      return "Not watching";
    case "Watch.mode.ignoring.title":
      return "Ignoring";
    default:
      return "error";
  }
};

class Watch extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    boardId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    currentWatchMode: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { currentWatchMode, dispatch, boardId, userId } = this.props;
    if (!currentWatchMode) {
      dispatch({
        type: "CHANGE_USER_WATCH",
        payload: { boardId, userId, newWatchMode: "Not watching" }
      });
    }
  };

  handleSelection = newWatchMode => {
    const { dispatch, boardId, userId } = this.props;
    if (newWatchMode !== this.props.currentWatchMode) {
      dispatch({
        type: "CHANGE_USER_WATCH",
        payload: { boardId, userId, newWatchMode }
      });
    }
  };

  addVIcon(watchMode) {
    const { currentWatchMode } = this.props;
    return watchMode === currentWatchMode ? (
      <Icon icon="tick-circle" color="success" marginRight={0} />
    ) : null;
  }

  renderWatchDiv = (mode, description) => {
    const { t } = this.props;
    return (
      <div>
        <span className="div-heading">{t(mode)}</span>
        <span className="div-description">{t(description)}</span>
      </div>
    );
  };

  render() {
    const { t } = this.props;
    const watchModes = [
      {
        mode: "Watch.mode.watching.title",
        description: "Watch.mode.watching.description"
      },
      {
        mode: "Watch.mode.not_watching.title",
        description: "Watch.mode.not_watching.description"
      },
      {
        mode: "Watch.mode.ignoring.title",
        description: "Watch.mode.ignoring.description"
      }
    ];

    return (
      <div>
        <Popover
          content={
            <Pane width={200}>
              {watchModes.map((watchMode, index) => (
                <div className="row" key={index}>
                  <Table.Row
                    height={60}
                    paddingY={12}
                    key={index}
                    isSelectable
                    onSelect={() => this.handleSelection(convertTitleToMode(watchMode.mode))}
                  >
                    <Table.TextCell>
                      {this.renderWatchDiv(
                        watchMode.mode,
                        watchMode.description
                      )}
                    </Table.TextCell>
                    <Table.Cell className="v-icon-wrapper" flex="none">
                      {this.addVIcon(convertTitleToMode(watchMode.mode))}
                    </Table.Cell>
                  </Table.Row>
                </div>
              )
              )}
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
            <div className="watch-header">{t("Watch.watch")}</div>
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
