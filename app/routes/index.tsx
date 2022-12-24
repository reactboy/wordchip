import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/domain/user/user.server";
import { safeRedirect } from "~/utils";
import { Header } from "~/components/layout/Header";
import { Button, FormInput } from "~/components/common";

const validator = withZod(
  z.object({
    username: z
      .string()
      .min(8, { message: "username must be more than 8 characters" }),
    password: z
      .string()
      .min(8, { message: "password must be more than 8 characters" }),
    redirectTo: z.string(),
    // remember: z.string(),
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

  const user = await verifyLogin(username, password);

  if (!user) {
    return json(
      { errors: { username: "Invalid username or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    // remember: remember === "on" ? true : false,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "wordchip",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/word";

  return (
    <>
      <Header />
      <div className="p-4">
        <ValidatedForm
          className="bg-blue-100 p-2 w-1/4 rounded-sm"
          validator={validator}
          method="post"
        >
          <div className="flex flex-col gap-2">
            <FormInput name="username" />
            <FormInput type="password" name="password" />
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="flex justify-between mt-2">
            <div className="text-sm">
              <input id="remember" name="remember" type="checkbox" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Button>Log in</Button>
          </div>
          <div className="flex justify-center gap-1 text-sm">
            <p>Don't have an account?</p>
            <Link
              className="text-blue-900 underline"
              to={{
                pathname: "/join",
                search: searchParams.toString(),
              }}
            >
              Sign up
            </Link>
          </div>
        </ValidatedForm>
      </div>
    </>
  );
}
