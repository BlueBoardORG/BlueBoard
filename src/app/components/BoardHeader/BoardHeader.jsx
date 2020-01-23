import React from "react";
import BoardTitle from "./BoardTitle";
import ColorPicker from "./ColorPicker";
import ImagePicker from "./ImagePicker";
import BoardDeleter from "./BoardDeleter";
import BoardLeave from "./BoardLeave";
import BoardArchiver from "./BoardArchiver";
import hiIcon from "../../../assets/images/Hi.png";
import Watch from "./Watch";

import "./BoardHeader.scss";

const BoardHeader = ({ isAbleToEdit,iFrameAction }) => (
  <div className="board-header">
    <BoardTitle isAbleToEdit={isAbleToEdit} />
    <div className="board-header-right">
    <div className="vertical-line" />
    <img  style={{width: 40, height: 40}} onClick={iFrameAction} src={hiIcon} ></img>
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <Watch />}
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <ColorPicker />}
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <ImagePicker />}
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <BoardArchiver />}
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <BoardDeleter />}
      {isAbleToEdit && <div className="vertical-line" />}
      <BoardLeave />
    </div>
  </div>
);

export default BoardHeader;
