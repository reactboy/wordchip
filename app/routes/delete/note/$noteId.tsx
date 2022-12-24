import { ActionFunction, redirect } from "@remix-run/router";
import { deleteNote } from "~/domain/note/note.server";
import invariant from "tiny-invariant";

export const action: ActionFunction = async ({ request, params }) => {
  const { noteId } = params;
  invariant(noteId, "noteId is required");
  const note = await deleteNote(noteId);
  invariant(note, "something went wrong, cant delete not");

  return redirect(`/word/${note?.wordId}`);
};
