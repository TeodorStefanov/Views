import picThree from "../../images/picThree.png";
import UserContext from "../../context/context";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import FontIcon from "../fontAwesomeIcon";
import styles from "./index.module.css";
import Image from "next/image";
import {
  faUserGroup,
  faRepeat,
  faPeopleGroup,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
const LeftMenu = () => {
  const router = useRouter();
  const context = useContext(UserContext);
  const { user } = context;
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <div
          className={styles.menuButton}
          onClick={() => router.push(`/views/${user?._id}`)}
        >
          <Image
            src={user!.picture}
            className={styles.userPicture}
            width={200}
            height={200}
            alt="pic"
          />
          <span>{user?.viewsName}</span>
        </div>
        <FontIcon icon={faUserGroup} title="friends" />
        <FontIcon icon={faRepeat} title="recent" />
        <FontIcon icon={faPeopleGroup} title="Groups" />
        <FontIcon icon={faShop} title="Marketplace" />
      </div>
      <div className={styles.advertisment}>
        <Image
          src={picThree}
          alt="pic"
          className={styles.advertismentPicture}
        />
      </div>
    </div>
  );
};
export default LeftMenu;
