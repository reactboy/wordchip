import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";

type ButtonProps = {
  children: ReactNode;
};
export const Button: FC<
  ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  const { children, className, ...restProps } = props;

  const extendedButtonClass = classNames(
    "font-bold py-1 px-2 rounded-md",
    className,
    {
      "text-neutral-50 bg-blue-500": !className,
    }
  );

  return (
    <button {...restProps} className={extendedButtonClass}>
      {children}
    </button>
  );
};
