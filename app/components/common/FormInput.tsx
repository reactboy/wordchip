import { FC } from "react";

type FormInputProps = {
  name: string;
  label?: string;
  type?: string;
};
export const FormInput: FC<FormInputProps> = (props) => {
  const { name, label, type = "text" } = props;

  return (
    <div>
      {label && <label className="block">{label}</label>}
      <input
        className="w-full p-1 bg-blue-50 text-blue-900 rounded-sm text-xl focus:outline-none focus:ring placeholder:text-blue-200"
        name={name}
        placeholder={name}
        type={type}
      />
    </div>
  );
};
