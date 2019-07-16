import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import PropTypes from "prop-types";



class LabelList extends Component {
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


    render() {

        return (
            
        );
    }
}

export default (LabelList);