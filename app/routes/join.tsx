import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByUsername } from "~/domain/user/user.server";
import { safeRedirect, validateUsername } from "~/utils";
import { Header } from "~/components/layout/Header";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard/word");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard/word");

  if (!validateUsername(username)) {
    return json(
      { errors: { username: "username is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { username: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { username: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return json(
      {
        errors: {
          username: "A user already exists with this username",
          password: null
        }
      },
      { status: 400 }
    );
  }

  const user = await createUser(username, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up"
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.username) {
      usernameRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <Header />
      <div className="p-4">
        <Form method="post">
          <div>
            <label htmlFor="username">username</label>
            <div className="mt-1">
              <input
                ref={usernameRef}
                id="username"
                required
                autoFocus={true}
                name="username"
                type="username"
                autoComplete="username"
                aria-invalid={actionData?.errors?.username ? true : undefined}
                aria-describedby="username-error"
              />
              {actionData?.errors?.username && (
                <div className="pt-1 text-red-700" id="username-error">
                  {actionData.errors.username}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
              />
              {actionData?.errors?.password && (
                <div id="password-error">{actionData.errors.password}</div>
              )}
            </div>
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button className="px-2 py-1 bg-blue-500 text-neutral-50 mt-2 rounded-md text-sm" type="submit">Create Account
          </button>
          <div>
            <div>
              Already have an account?{" "}
              <Link
                className="text-blue-900 underline"
                to={{
                  pathname: "/",
                  search: searchParams.toString()
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}