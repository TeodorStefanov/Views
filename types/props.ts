import React from "react";

export default interface Props {
  name: string;
  label: string;
  value: string;
  type: string;
  placeHolder: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}
export type userProps = {
  name: string;
  email: string;
};
