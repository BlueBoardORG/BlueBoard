import image1 from "./assets/images/stone.jpg";
import image2 from "./assets/images/sunset.jpg";
import image3 from "./assets/images/terrace.jpg";
import image4 from "./assets/images/red.jpg";
import image5 from "./assets/images/casa.jpg";
import image6 from "./assets/images/colleseum.jpg";
import image7 from "./assets/images/forest.jpg";
import image8 from "./assets/images/HDcolor.jpg";
import image9 from "./assets/images/hongKong.jpg";
import image10 from "./assets/images/kept.jpg";
import image11 from "./assets/images/lasvegas.jpg";
import image12 from "./assets/images/los.jpg";
import image13 from "./assets/images/macaron.jpg";
import image14 from "./assets/images/newYork.jpg";
import image15 from "./assets/images/sea.jpg";
import image16 from "./assets/images/sheep.jpg";

export const ADMIN_ROLE = "admin";
export const READ_WRITE_ROLE = "read-write";
export const READ_ROLE = "read";
export const SOCKETLOCATION = process.env.REACT_APP_SOCKETLOCATION || "localhost:8200"

export const DEFAULT_ROLE = READ_WRITE_ROLE;
export const CAN_EDIT_ROLES = [ADMIN_ROLE, READ_WRITE_ROLE];

export const PUBLIC_USER_PROPERTIES = ["_id", "name","display"];

export const BOARD_BG_URLS = [image1,image2,image3,image4,image5,image6,image7,image8,image9,image10,image11,image12,image13,image14,image15,image16];
