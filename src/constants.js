import image1 from "./assets/images/backgroundImage.jpg";
import image2 from "./assets/images/backgroundImage2.jpg";
import image3 from "./assets/images/backgroundImage3.jpg";
import image4 from "./assets/images/backgroundImage4.jpg";

export const ADMIN_ROLE = "admin";
export const READ_WRITE_ROLE = "read-write";
export const READ_ROLE = "read";
export const SOCKETLOCATION = process.env.REACT_APP_SOCKETLOCATION || "localhost:8200"

export const DEFAULT_ROLE = READ_WRITE_ROLE;
export const CAN_EDIT_ROLES = [ADMIN_ROLE, READ_WRITE_ROLE];

export const PUBLIC_USER_PROPERTIES = ["_id", "name","display"];

export const BOARD_BG_URLS = [image1,image2,image3,image4];
