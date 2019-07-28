import React, { Component } from "react";
import FaArchive from "react-icons/lib/fa/archive";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

class ArchiveButton extends Component {
  render() {
    const { t } = this.props;

    return (
      <Link to="/archive" className="signout-link">
        <FaArchive className="signout-icon" />
        &nbsp; {t("archive.title")}
      </Link>
    );
  }
}

export default withTranslation()(ArchiveButton);
