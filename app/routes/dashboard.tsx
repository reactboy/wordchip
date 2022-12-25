import type { ActionFunction, LoaderFunction } from "@remix-run/router";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/session.server";
import { redirect } from "@remix-run/router";
import { Header } from "~/components/layout/Header";

export const action: ActionFunction = () => {
  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/");
  return { user };
};

export default function DashboardView() {
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
