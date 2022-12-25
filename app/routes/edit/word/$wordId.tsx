import { ActionFunction, LoaderFunction, redirect } from "@remix-run/router";
import { getUser, getUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { Button, FormInput } from "~/components/common";
import { getWord, updateWord } from "~/domain/word/word.server";
import invariant from "tiny-invariant";

const validator = withZod(
  z.object({
    title: z.string().min(2, { message: "title is required" }),
    description: z.string().min(2, { message: "description is required" }),
  })
);

export const action: ActionFunction = async ({ request, params }) => {
  const { wordId } = params;
  invariant(wordId, "wordId is missing");

  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const {
    data: { title, description },
  } = data;

  const userId = await getUserId(request);
  //TODO: some error handling
  if (!userId) return redirect("/dashboard/word");

  //TODO: some error handling
  const word = await updateWord({ id: wordId, title, description });
  invariant(word, "word update failed");

  return redirect("/dashboard/word");
};

export const loader: LoaderFunction = async ({ params }) => {
  const { wordId } = params;
  invariant(wordId, "wordId is missing");
  const word = await getWord(wordId);
  return { word };
};
export default function WordEditView() {
  const { word } = useLoaderData();
  return (
    <div className="w-1/2 mx-auto bg-blue-100 rounded-sm p-4">
      <p className="text-2xl text-blue-500 font-bold">Edit Word</p>
      <ValidatedForm validator={validator} method="post">
        <div className="flex flex-col gap-4 mt-2">
          <FormInput name="title" defaultValue={word.title} />
          <FormInput name="description" defaultValue={word.description} />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </ValidatedForm>
    </div>
  );
}
