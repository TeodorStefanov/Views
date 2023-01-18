import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { FC, useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import UserContext from "../../context";
import styles from "./id.module.css";
const Profile: FC = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const context = useContext(UserContext);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const { user } = context;

  useEffect(() => {
    if (user) {
      if (user._id === id.id) {
        setLoggedUser(true);
      }
    }
  }, [user]);
  if (loggedUser) {
    return <div></div>;
  }
  return (
    <Layout>
      {!loggedUser ? (
        <div className={styles.container}>
          <div className={styles.left}></div>
          <div className={styles.middle}>
            <div className={styles.top}>
              <div
                style={{
                  backgroundImage:
                    'url("https://res.cloudinary.com/daqcaszkf/image/upload/v1674032617/1584x396-pale-aqua-solid-color-background_skjmq8.jpg")',
                }}
                className={styles.topPicture}
              >
                <div className={styles.topAddPicture}>Add cover picture</div>
              </div>
              <img src={user?.picture} className={styles.picture}></img>
              {user?.friends}
            </div>
            <div>
              <b className={styles.viewsName}>{user?.viewsName}</b>
            </div>
          </div>
          <div className={styles.right}></div>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
};

export default Profile;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params;
  return {
    props: {
      id,
    },
  };
};
