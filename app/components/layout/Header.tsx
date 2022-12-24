import { FC } from "react";
import type { User } from "@prisma/client";
import { useSubmit } from "@remix-run/react";

type HeaderProps = {
  user?: User;
};
export const Header: FC<HeaderProps> = (props) => {
  const { user } = props;

  const submit = useSubmit();
  const onClickLogout = () => {
    submit(null, { method: "post", action: "/logout" });
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 py-2 bg-blue-100">
        <h1 className="text-blue-500 text-xl font-bold">wordchip</h1>
        {user && (
          <div className="gap-2 flex items-center">
            <p className="text-blue-500">{user.username}</p>
            <button
              className="text-red-400 px-2 py-1 rounded-lg hover:text-red-500 hover:bg-blue-50 transition"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
