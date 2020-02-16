import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import SearchIcon from '@material-ui/icons/Search';

class SearchBar extends React.Component {
  componentDidMount() {
    const cardsById = this.props.cardsById;

    this.props.dispatch({
      type: "CHANGE_CARD_FILTER",
      payload: this.props.currFilter
    });
  }

  render() {
    const styles = {
      container: {
        display: "flex",
        alignItems: "center",
        padding: 4,
        background: "hsla(0,7%,92%,.3);",
        borderRadius: 3,
        height: 30,
        color: "white"
      },
      text: {
        display: "flex",
        background: "transparent",
        color: "white",
        border: "none",
        fontSize: "20px",
        outline: "none"
      },
      icon: {
        height: "25px",
      }
    };
    const { t } = this.props;
    return (
      <div style={styles.container}>
        <input placeholder={t("SearchBar.placeholder")} onChange={this._onChangeText} style={styles.text} value={this.props.currFilter} />
        <SearchIcon color="white" />
      </div>
    );
  }

  _onChangeText = e => {
    const text = e.target.value;
    this.props.dispatch({
      type: "CHANGE_CARD_FILTER",
      payload: text
    });
  };
}

const mapStateToProps = state => ({ cardsById: state.cardsById, currFilter: state.currFilter });

export default connect(mapStateToProps)(withTranslation()(SearchBar));
