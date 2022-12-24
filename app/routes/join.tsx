import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByUsername } from "~/domain/user/user.server";
import { safeRedirect } from "~/utils";
import { Header } from "~/components/layout/Header";
import { Button, FormInput } from "~/components/common";

const validator = withZod(
  z.object({
    username: z
      .string()
      .min(8, { message: "username must be longer than 8 characters" }),
    password: z
      .string()
      .min(8, { message: "password must be longer than 8 characters" }),
    redirectTo: z.string(),
  })
);

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard/word");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);

  const {
    data: { username, password },
  } = data;

  const redirectTo = safeRedirect(data.data.redirectTo, "/dashboard/word");

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return json(
      {
        errors: {
          username: "A user already exists with this username",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const user = await createUser(username, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  return (
    <>
      <Header />
      <div className="p-4">
        <ValidatedForm
          className="bg-blue-100 p-2 rounded-sm w-1/4"
          method="post"
          validator={validator}
        >
          <div className="flex flex-col gap-2">
            <FormInput name="username" />
            <FormInput name="password" type="password" />
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="mt-2 flex justify-end gap-2">
            <Button>Create Account</Button>
          </div>
          <div className="text-sm mt-2 flex justify-center gap-1">
            <p>Already have an account?</p>
            <Link
              className="text-blue-900 underline"
              to={{
                pathname: "/",
                search: searchParams.toString(),
              }}
            >
              Log in
            </Link>
          </div>
        </ValidatedForm>
      </div>
    </>
  );
}
