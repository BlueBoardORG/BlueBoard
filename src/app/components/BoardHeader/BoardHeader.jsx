import React from "react";
import BoardTitle from "./BoardTitle";
import ColorPicker from "./ColorPicker";
import ImagePicker from "./ImagePicker";
import BoardDeleter from "./BoardDeleter";
import BoardLeave from "./BoardLeave";
import BoardArchiver from "./BoardArchiver";

import "./BoardHeader.scss";

const BoardHeader = ({ isAbleToEdit, isCurrentUserAdmin }) => (
  <div className="board-header">
    <BoardTitle isAbleToEdit={isAbleToEdit} />
    <div className="board-header-right">
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <ColorPicker />}
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <ImagePicker />}
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <BoardArchiver />}
      {isCurrentUserAdmin ? <div className="vertical-line" /> : null}
      {isCurrentUserAdmin && <BoardDeleter />}
      {isAbleToEdit && <div className="vertical-line" />}
      <BoardLeave />
    </div>
  </div>
);

export default BoardHeader;
