import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import PropTypes from "prop-types";



class LabelEditor extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        cardId: PropTypes.string.isRequired,
        boardId: PropTypes.string.isRequired,
        labelId: PropTypes.string,
        dispatch: PropTypes.func.isRequired,
    }
    constructor() {
        super();
    }

    deleteLabel = () => {
        const { dispatch, boardId ,labelId} = this.props;
        dispatch({
            type: "REMOVE_LABEL_FROM_BOARD",
            payload: { boardId: boardId, labelToRemove: labelId }
        });
    };

    render() {
        const {
            isOpen
        } = this.props;
        return (
            <div >
                {isOpen
                    ? <div><input></input>
                        <input></input>
                        <button className="color-picker-color"> אישור</button>
                        <button onClick={this.deleteLabel} className="color-picker-color">מחק </button></div>
                    : null
                }
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