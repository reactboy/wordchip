import { LoaderFunction } from "@remix-run/router";
import { getUser } from "~/session.server";
import { Header } from "~/components/layout/Header";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return {
    user,
  };
};

export default function WordLayout() {
  const { user } = useLoaderData();

  return (
    <>
      <Header user={user} />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
