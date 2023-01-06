import Props from "../../../types/props";
import styles from "./index.module.css";
export default function InputFiled(props: Props) {
  return (
    <div className={styles.container}>
      <label htmlFor={props.name}>
        <input
          id={props.name}
          type={props.type}
          className={styles.field}
          placeholder={props.placeHolder}
        />
      </label>
    </div>
  );
}
