import image from "./assets/images/backgroundImage.jpg";
import imageSmall from "./assets/images/backgroundImage-small.jpg";

export const ADMIN_ROLE = "admin";
export const READ_WRITE_ROLE = "read-write";
export const READ_ROLE = "read";
export const SOCKETLOCATION = process.env.REACT_APP_SOCKETLOCATION || "https://socketioamanboard.prod.services.idf/"

export const DEFAULT_ROLE = READ_WRITE_ROLE;
export const CAN_EDIT_ROLES = [ADMIN_ROLE, READ_WRITE_ROLE];

export const PUBLIC_USER_PROPERTIES = ["_id", "name","display"];

export const BASE_BOARD_BG_URL = image; 
export const BASE_BOARD_BG_URL_SMALL = imageSmall;
