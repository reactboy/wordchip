import { FC } from "react";
import classNames from "classnames";

type RadioInputProps = {
  className?: string;
  id: string;
  name: string;
  value: string;
  defaultChecked?: boolean;
};

export const RadioInput: FC<RadioInputProps> = (props) => {
  const { className, defaultChecked = false, id, name, value } = props;
  const extendedClassName = classNames(
    "flex items-center gap-1 px-1 rounded-2xl",
    className
  );
  return (
    <div className={extendedClassName}>
      <input
        defaultChecked={defaultChecked}
        id={id}
        name={name}
        value={value}
        type="radio"
      />
      <label className="cursor-pointer" htmlFor={id}>
        {value}
      </label>
    </div>
  );
};
