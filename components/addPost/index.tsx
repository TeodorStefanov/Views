import React from "react";
import styles from "./index.module.css";
import Image from "next/image";
interface fields {
  picture: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickPicture: () => void;
  handleClickVideo: (e: React.MouseEvent) => void;
  handleClickPost: (e: React.MouseEvent) => void;
  value: string;
}
const AddPost = ({
  picture,
  onChange,
  handleClickPicture,
  handleClickVideo,
  handleClickPost,
  value,
}: fields) => {
  return (
    <div className={styles.addSomething}>
      <div className={styles.imageInput}>
        <Image src={picture} className={styles.addSomethingPicture} alt="pic" />

        <input
          name="Add something"
          className={styles.addSomethingField}
          onChange={onChange}
          value={value}
        />
      </div>
      <div className={styles.addSomethingButtons}>
        <button
          className={styles.addSomethingButton}
          onClick={handleClickPicture}
        >
          Add Picture
        </button>
        <button
          className={styles.addSomethingButton}
          onClick={handleClickVideo}
        >
          Add Video
        </button>
        <button
          className={styles.addSomethingButtonPost}
          onClick={handleClickPost}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default AddPost;
