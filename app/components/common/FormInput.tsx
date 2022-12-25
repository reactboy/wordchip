import { FC, InputHTMLAttributes, forwardRef } from "react";
import classNames from "classnames";

type FormInputProps = {
  name: string;
  label?: string;
  type?: string;
};
export const FormInput = forwardRef<
  HTMLInputElement,
  FormInputProps & InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const { name, label, type = "text", className, ...inputProps } = props;

  const extendedInputClass = classNames(className, "w-full p-1 focus:ring", {
    "bg-blue-50 text-blue-900 rounded-sm text-xl focus:outline-none placeholder:text-blue-200":
      !className,
  });

  return (
    <div>
      {label && <label className="block">{label}</label>}
      <input
        ref={ref}
        className={extendedInputClass}
        name={name}
        placeholder={name}
        type={type}
        {...inputProps}
      />
    </div>
  );
});
