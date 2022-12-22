import { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
};
export const Button: FC<
  ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      {...restProps}
      className="text-neutral-50 bg-blue-500 font-bold py-1 px-2 rounded-md"
    >
      {children}
    </button>
  );
};
