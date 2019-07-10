import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Droppable } from "react-beautiful-dnd";
import Card from "../Card/Card";

class Cards extends Component {
  static propTypes = {
    listId: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(PropTypes.string).isRequired,
    isAbleToEdit: PropTypes.bool.isRequired
  };
  

  render() {
    const { listId, cards, isAbleToEdit } = this.props;
    const filteredCardsById = this.props.filteredCardsById;

    return (
      <Droppable droppableId={listId} isDropDisabled={!isAbleToEdit}>
        {(provided, { isDraggingOver }) => (
          <>
              <div className="cards" ref={provided.innerRef}>
                {cards.map((cardId, index) => (
                  filteredCardsById[cardId] ? <Card
                    isDraggingOver={isDraggingOver}
                    key={cardId}
                    cardId={cardId}
                    index={index}
                    listId={listId}
                    isAbleToEdit={isAbleToEdit}
                  /> : null
                ))}
                {provided.placeholder}
                <div
                  style={{ float: "left", clear: "both" }}
                  ref={el => {
                    this.listEnd = el;
                  }}
                />
              </div>
          </>
        )}
      </Droppable>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  cards: state.listsById[ownProps.listId].cards,
  filteredCardsById: state.filteredCardsById
});

export default connect(mapStateToProps)(Cards);
