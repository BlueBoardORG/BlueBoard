import React from "react";
import BoardTitle from "./BoardTitle";
import ColorPicker from "./ColorPicker";
import ImagePicker from "./ImagePicker";
import BoardDeleter from "./BoardDeleter";
import BoardLeave from "./BoardLeave";
import BoardArchiver from "./BoardArchiver";
import hiIcon from "../../../assets/images/Hi.png";
import Watch from "./Watch";
import BoardMenu from "./BoardMenu";

import "./BoardHeader.scss";

const BoardHeader = ({ isAbleToEdit,iFrameAction ,chatRoomId}) => (
  <div className="board-header">
    <BoardTitle isAbleToEdit={isAbleToEdit} />
    <div className="board-header-right">
    <div className="vertical-line" />
    {(isAbleToEdit && chatRoomId) ? <img  style={{width: 35, height: 35 ,cursor:"pointer"}} onClick={iFrameAction} src={hiIcon} /> : null}
      {(isAbleToEdit && chatRoomId) && <div className="vertical-line" />}
      {isAbleToEdit && <Watch />}
      {isAbleToEdit && <div className="vertical-line" />}
      {/* {isAbleToEdit && <ColorPicker />}
      {isAbleToEdit && <div className="vertical-line" />} */}
      {isAbleToEdit && <ImagePicker />}
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <BoardArchiver />}
      {isAbleToEdit && <div className="vertical-line" />}
      {isAbleToEdit && <BoardDeleter />}
      {isAbleToEdit && <div className="vertical-line" />}
      <BoardLeave />
      <div className="vertical-line" />
      <BoardMenu />
    </div>
  </div>
);

export default BoardHeader;
