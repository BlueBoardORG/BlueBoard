import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";



class LabelEditor extends Component {
    static propTypes = {
        cardId: PropTypes.string.isRequired,
        boardId: PropTypes.string.isRequired,
        labelId: PropTypes.string,
        dispatch: PropTypes.func.isRequired,
    }
    constructor() {
        super();
        this.state = {
            title: null,
            color: null
        };
    }
    handleChangeTitle = (e) => {
        this.setState({ title: e.target.value });
    }
    handleChangeColor = (e) => {
        this.setState({ color: e.target.value });
    }

    deleteLabel = () => {
        const { dispatch, boardId, labelId } = this.props;
        dispatch({
            type: "REMOVE_LABEL_FROM_BOARD",
            payload: { boardId: boardId, labelToRemove: labelId }
        });
        this.props.action();
    };

    editLabel = () => {
        const { title, color } = this.state;
        const { dispatch, boardId, labelId } = this.props;
        dispatch({
            type: "Edit_LABEL",
            payload: { boardId, editLabel: { id: labelId, title: title, color: color } }
        });
        this.props.action();
    };

    render() {
        return (
            <div>
                <input onChange={this.handleChangeTitle}></input>
                <input onChange={this.handleChangeColor} ></input>
                <button onClick={this.editLabel} className="color-picker-color"> אישור</button>
                <button onClick={this.deleteLabel} className="color-picker-color">מחק </button>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    const boardLabel = state.boardsById[ownProps.boardId].labels;
    const cardLabel = state.cardsById[ownProps.cardId].labels;
    return {
        boardLabels: boardLabel,
        cardLabels: cardLabel
    };
};

export default connect(mapStateToProps)(LabelEditor);