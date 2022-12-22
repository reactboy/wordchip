import { FC } from "react";

type FormInputProps = {
  name: string;
  label?: string;
};
export const FormInput: FC<FormInputProps> = (props) => {
  const { name, label } = props;

  return (
    <div>
      {label && <label className="block">{label}</label>}
      <input
        className="w-full p-1 text-slate-600 font-bold rounded-md text-xl focus:outline-none focus:ring"
        name={name}
        placeholder={name}
      />
    </div>
  );
};
