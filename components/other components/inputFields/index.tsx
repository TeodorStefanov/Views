import Props from "../../../types/props";
export default function InputFiled(props: Props) {
  return (
    <div>
      <label htmlFor={props.name}>
        {props.label}
        <input id={props.name}></input>
      </label>
    </div>
  );
}
