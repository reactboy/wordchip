import { ActionFunction, LoaderFunction, redirect } from "@remix-run/router";
import { getWord } from "~/domain/word/word.server";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Note, Word } from "@prisma/client";
import { Button, FormInput } from "~/components/common";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { getUserId } from "~/session.server";
import { createNote } from "~/domain/note/note.server";
import classNames from "classnames";
import invariant from "tiny-invariant";

const validator = withZod(
  z.object({
    comment: z.string().min(1, { message: "comment should not be empty" }),
    kind: z.string(),
  })
);

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const { wordId } = params;

  invariant(userId, "userId required");
  invariant(wordId, "wordId required");

  const data = await validator.validate(await request.formData());

  if (data.error) return validationError(data.error);

  const {
    data: { comment, kind },
  } = data;

  await createNote({
    userId,
    wordId,
    body: comment,
    kind,
    createdBy: userId,
    updatedBy: userId,
  });

  return null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { wordId } = params;
  invariant(wordId, "wordId required");

  const word = await getWord(wordId);
  return { word };
};

export default function WordDetail() {
  const { word } = useLoaderData<{ word: Word & { notes: Note[] } }>();
  const submit = useSubmit();
  const navigate = useNavigate();
  const onClickBack = () => {
    navigate("/dashboard/word");
  };

  const onClickDeleteNote = (noteId: string) => () => {
    submit(null, {
      method: "post",
      action: `/delete/note/${noteId}`,
      replace: false,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <h1 className="text-4xl font-bold text-blue-600">{word.title}</h1>
          <p className="self-end text-blue-400 font-medium">
            {word.description}
          </p>
        </div>
        <Button onClick={onClickBack}>back</Button>
      </div>
      <div className="p-4">
        <ValidatedForm
          method="post"
          validator={validator}
          resetAfterSubmit={true}
          className="bg-blue-100 py-3 px-2 rounded-sm"
        >
          <div className="w-full">
            <FormInput name="comment" />
          </div>
          <div className="flex justify-between mt-2 items-center">
            <div className="flex gap-2 items-start">
              <div className="bg-blue-200 text-blue-500 border border-blue-500 flex items-center gap-1 px-1 rounded-2xl">
                <input
                  defaultChecked
                  id="kind-note"
                  name="kind"
                  value="note"
                  type="radio"
                />
                <label className="cursor-pointer" htmlFor="kind-note">
                  note
                </label>
              </div>
              <div className="bg-yellow-200 text-yellow-500 border border-yellow-500 flex items-center gap-1 px-1 rounded-2xl">
                <input id="kind-tips" name="kind" value="tips" type="radio" />
                <label className="cursor-pointer" htmlFor="kind-tips">
                  tips
                </label>
              </div>
              <div className="bg-green-200 text-green-500 border border-green-500 flex items-center gap-1 px-1 rounded-2xl">
                <input
                  id="kind-notice"
                  name="kind"
                  value="notice"
                  type="radio"
                />
                <label className="cursor-pointer" htmlFor="kind-notice">
                  notice
                </label>
              </div>
            </div>
            <Button type="submit">Post</Button>
          </div>
        </ValidatedForm>
        {!!word.notes.length && (
          <div className="py-4 flex flex-col gap-2">
            {word.notes.map((note) => {
              const noteClass = classNames("p-2", {
                "bg-blue-100 text-blue-700 text-md border-2 border-blue-500 rounded-md":
                  note.kind === "note",
                "bg-yellow-100 text-yellow-700 text-md border-2 border-yellow-500 rounded-md":
                  note.kind === "tips",
                "bg-green-100 text-green-700 text-md border-2 border-green-500 rounded-md":
                  note.kind === "notice",
              });
              return (
                <div key={note.id} className={noteClass}>
                  <div className="flex justify-between">
                    <p>{note.body}</p>
                    <Button onClick={onClickDeleteNote(note.id)}>delete</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
