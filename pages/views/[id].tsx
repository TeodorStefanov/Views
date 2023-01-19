import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { FC, useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import UserContext from "../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./id.module.css";
import User from "../../models/user";
const Profile: FC = ({
  userFind,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const context = useContext(UserContext);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<boolean>(false);
  const { user } = context;
  useEffect(() => {
    if (user) {
      if (user._id === userFind._id) {
        setLoggedUser(true);
      }
    }
  }, [user]);
  if (!userFind) {
    return <div></div>;
  }
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.left}></div>
        <div className={styles.middle}>
          <div className={styles.top}>
            <div
              style={{
                backgroundImage: `url(${userFind.backgroundPicture})`,
              }}
              className={styles.topPicture}
            >
              {loggedUser ? (
                <div className={styles.topAddPicture}>Add cover picture</div>
              ) : (
                ""
              )}
            </div>
            <img
              src={userFind.picture}
              className={styles.picture}
              onClick={() => setProfilePicture(true)}
            ></img>
            {!loggedUser ? (
              <button type="button" className={styles.follow}>
                Follow
              </button>
            ) : (
              ""
            )}
          </div>
          <div className={styles.middleMain}>
            <b className={styles.viewsName}>{user?.viewsName}</b>
            <p>Description</p>
            <div>{userFind.friends.length} Following</div>
          </div>
        </div>
        <div className={styles.right}></div>
      </div>
      {profilePicture ? (
        <div className={styles.modalContainer}>
          <div className={styles.modalMain}>
            <img src={userFind.picture} className={styles.modalPicture} />
          </div>
          <div className={styles.overlay}></div>
          <div
            className={styles.modalOverlayButton}
            onClick={() => setProfilePicture(false)}
          >
            <FontAwesomeIcon className={styles.markButton} icon={faXmark} />
          </div>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
};

export default Profile;
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.params as { id: string };

    const userFind = await User.findById(id);
    return {
      props: {
        userFind: JSON.parse(JSON.stringify(userFind)),
      },
    };
  } catch (err) {
    return {
      props: {
        userFind: null,
      },
    };
  }
};
