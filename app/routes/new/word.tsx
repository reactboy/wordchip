import { ActionFunction, LoaderFunction, redirect } from "@remix-run/router";
import { getUser, getUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { Button, FormInput } from "~/components/common";
import { createWord } from "~/domain/word/word.server";

const validator = withZod(
  z.object({
    title: z.string().min(2, { message: "title is required" }),
    description: z.string().min(2, { message: "description is required" }),
  })
);

export const action: ActionFunction = async ({ request }) => {
  const data = await validator.validate(await request.formData());
  console.log(data.error);
  console.log(data);
  if (data.error) return validationError(data.error);
  const {
    data: { title, description },
  } = data;

  const userId = await getUserId(request);
  //TODO: some error handling
  if (!userId) return redirect("/dashboard/word");

  const res = await createWord({
    title,
    description,
    userId,
    updatedBy: userId,
    createdBy: userId,
  });

  //TODO: some error handling
  if (!res) return redirect("/dashboard/word");

  return redirect("/dashboard/word");
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return { user };
};
export default function WordNewView() {
  const { user } = useLoaderData();
  console.log(user);
  return (
    <div className="w-1/2 mx-auto bg-neutral-50 rounded-xl p-4">
      <p className="text-2xl text-slate-600 font-bold">Create Word</p>
      <ValidatedForm validator={validator} method="post">
        <div className="flex flex-col gap-4 mt-2">
          <FormInput name="title" />
          <FormInput name="description" />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </ValidatedForm>
    </div>
  );
}
