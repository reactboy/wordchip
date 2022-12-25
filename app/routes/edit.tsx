import { Header } from "~/components/layout/Header";
import { requireUser } from "~/session.server";
import { LoaderFunction } from "@remix-run/router";
import { Outlet } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/common";
import { useNavigate } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  return { user };
};

export default function EditLayout() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const onClickBack = () => {
    navigate("/dashboard/word");
  };

  return (
    <>
      <Header user={user} />
      <div className="p-4 flex justify-end">
        <Button onClick={onClickBack}>back</Button>
      </div>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
