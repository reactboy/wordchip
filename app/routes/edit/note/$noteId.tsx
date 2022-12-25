import { ActionFunction, redirect } from "@remix-run/router";
import invariant from "tiny-invariant";
import { validationError } from "remix-validated-form";

//TODO(eastasian) domain毎にvalidatorを共通化する
import { validator } from "~/domain/note/components/NoteItem";
import { updateNote } from "~/domain/note/note.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { noteId } = params;
  invariant(noteId, "noteId is missing");

  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);

  const {
    data: { comment },
  } = data;

  const note = await updateNote({ id: noteId, body: comment });
  invariant(note, "note update failed");

  return redirect(`/word/${note.wordId}`);
};
