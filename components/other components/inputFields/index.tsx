import React from "react";
import styles from "./index.module.css";
import { UseFormRegisterReturn } from "react-hook-form";
export interface Props {
  formHook: UseFormRegisterReturn;
  name: string;
  label: string;
  value: string;
  type: string;
  placeHolder: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}
export default function InputFiled(props: Props) {
  return (
    <div className={styles.container}>
      <label htmlFor={props.name}>
        <input
          {...props.formHook}
          id={props.name}
          type={props.type}
          className={styles.field}
          placeholder={props.placeHolder}
          onChange={props.onChange}
          autoComplete=""
        />
      </label>
    </div>
  );
}
