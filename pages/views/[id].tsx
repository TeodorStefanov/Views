import { useRouter } from "next/router";
import React, { FC, useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import UserContext from "../../context";
const Profile: FC = () => {
  const route = useRouter();
  const { id } = route.query;
  const context = useContext(UserContext);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const { user } = context;
  const getLoggedUser = (): void => {
    console.log(id);
    if (user) {
      if (user._id === id) {
        setLoggedUser(true);
      } else {
        console.log(loggedUser);
      }
    }
  };
  useEffect(() => {
    getLoggedUser();
  }, [id]);
  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default Profile;
