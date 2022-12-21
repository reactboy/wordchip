import { Outlet } from "@remix-run/react";

export default function() {
  return (
    <>
      word
      <div>
        <Outlet />
      </div>
    </>
  );
}
