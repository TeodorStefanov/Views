import React, { FC, useState } from "react";
import Layout from "../../components/layout/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import styles from "./index.module.css";
import getNavigation from "../../navigation";
interface IFormInputs {
  searchMenu: string;
}
const Views: FC = () => {
  const [pressedButton, setPressedButton] = useState<string>("All");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const links = getNavigation();
  const handleClick = () => {};
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.left}></div>
        <div className={styles.middle}>
          <div>
            <label htmlFor="searchMenu">
              <input
                {...register("searchMenu")}
                id="searchMenu"
                type="text"
                placeholder="Search in Views"
                className={styles.searchMenu}
              />
            </label>
            <FontAwesomeIcon
              className={styles.searchButton}
              icon={faMagnifyingGlass}
              onClick={handleClick}
            />
          </div>
          <div className={styles.navigation}>
            {links.map((el, index) => {
              return (
                <div
                  className={`${styles.navigationLink} ${
                    pressedButton === el.title ? styles.pressedButton : ""
                  }`}
                  key={index}
                  onClick={(e) => setPressedButton(el.title)}
                >
                  {el.title}
                </div>
              );
            })}
          </div>
          <div className={styles.share}>
            <label>
              Share
              <input className={styles.shareField} />
            </label>
            <div>Picture</div>
            <div>Video</div>
          </div>
        </div>
        <div className={styles.right}></div>
      </div>
    </Layout>
  );
};

export default Views;
