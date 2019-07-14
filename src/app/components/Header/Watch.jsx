import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";


class Watch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          watch: null
        };
    }

    render() {
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
            <div style={styles.container}>Watch</div>
        );
    }
}

export default Watch;