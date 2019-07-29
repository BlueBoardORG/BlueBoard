import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./LabelEditor.scss"
import LabelColorPicker from "./LabelColorPicker";



class LabelEditor extends Component {
    static propTypes = {
        action: PropTypes.func.isRequired,
        boardId: PropTypes.string.isRequired,
        label: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        cards : PropTypes.object.isRequired,
    }
    constructor() {
        super();
        this.state = {
            title: null
        };
    }
    handleChangeTitle = (e) => {
            this.setState({ title: e.target.value });
        
    }

    deleteLabel = () => {
        const { dispatch, boardId, label } = this.props;
        dispatch({
            type: "REMOVE_LABEL_FROM_BOARD",
            payload: {  boardId, labelToRemove: label.id }
        });

        
        for (let card in this.props.cards) {
            if(this.props.cards[card].labels && this.props.cards[card].labels.includes(label.id)){
            dispatch({
                type: "DELETE_LABEL",
                payload: { label:label.id, cardId: card }
            });
        }
        }
        this.props.action();
    };

    editLabel = () => {
        const { title } = this.state;
        const { dispatch, boardId, label } = this.props;
        dispatch({
            type: "Edit_LABEL",
            payload: { boardId, editedLabel: { id: label.id,  title,  color:null } }
        });
        this.props.action();
    };
    render() {
        const {label} = this.props;
        const {title}=this.state;
        return (
            <div className="editor">
                <input className="titel-textarea"  onChange={this.handleChangeTitle} value={(title!==null) ? title : label.title } maxLength={14}/>
                <LabelColorPicker label={label} />
                <div style={{flexdirection : "column"}}>
                    <button  onClick={this.editLabel} className="edit-button-ok"> אישור</button>
                    <button onClick={this.deleteLabel} className="edit-button-delete">מחק </button>
                </div>
            </div>


        );
    }
}
const mapStateToProps = (state) => {
    const cards = state.cardsById;
    return {
        cards
    };
};

export default connect(mapStateToProps)(LabelEditor);