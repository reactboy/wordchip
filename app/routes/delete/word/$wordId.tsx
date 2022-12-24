import { ActionFunction, redirect } from "@remix-run/router";
import invariant from "tiny-invariant";
import { deleteWord } from "~/domain/word/word.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { wordId } = params;
  invariant(wordId, "wordId required");

  const word = await deleteWord(wordId);
  invariant(word, "something went wrong, word not deleted");

  return redirect("/dashboard/word");
};
