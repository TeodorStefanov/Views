import UserContext from "../../context/context";
import picOne from "../../images/picOne.jpg";
import picTwo from "../../images/picTwo.jpg";
import { UserData } from "../../utils/types";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";
import Image from "next/image";
const RightMenu = () => {
  const context = useContext(UserContext);
  const { user } = context;
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.advertismentOne}>
        <Image
          src={picOne}
          alt="pic"
          className={styles.advertismentPictureOne}
        />
      </div>
      <div className={styles.advertismentTwo}>
        <Image
          src={picTwo}
          alt="pic"
          className={styles.advertismentPictureOne}
        />
      </div>
      <div className={styles.contacts}>
        <p className={styles.contactsTitle}>Contacts</p>
        {user?.friends.map((el: UserData, index: number) => {
          return (
            <div
              className={styles.contactsPictureName}
              onClick={() => router.push(`/views/${el._id}`)}
              key={index}
            >
              <Image
                src={el.picture}
                className={styles.contentPicture}
                width={200}
                height={200}
                alt="pic"
              />{" "}
              {el.viewsName}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default RightMenu;
