import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import UserContext from "../../context";
const Profile = () => {
  const route = useRouter();
  const context = useContext(UserContext);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const { user } = context;
  const { id } = route.query;
  const getLoggedUser = (): void => {
    if (user?.picture === id) {
      setLoggedUser(true);
    }
  };
  useEffect(() => {
    getLoggedUser();
  }, []);
  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default Profile;

