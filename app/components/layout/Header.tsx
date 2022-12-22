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
      <div className="flex justify-between items-center px-4 py-2 bg-slate-900">
        <h1 className="text-neutral-50 text-xl font-bold">wordchip</h1>
        {user && (
          <div className="gap-2 flex items-center">
            <p className="text-neutral-200">{user.username}</p>
            <button
              className="text-slate-400 px-2 py-1 rounded-lg hover:text-neutral-50 hover:bg-slate-800 transition"
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
