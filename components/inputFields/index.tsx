"use client";
import React from "react";
import styles from "./index.module.css";
import { UseFormRegisterReturn } from "react-hook-form";
export interface Props {
  formHook?: UseFormRegisterReturn;
  name: string;
  label: string;
  type: string;
  placeHolder: string;
  errorMessage?: string;
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
          autoComplete=""
        />
      </label>
      {props.errorMessage ? (
        <div className={styles.errorMessage}>{props.errorMessage}</div>
      ) : (
        ""
      )}
    </div>
  );
}
