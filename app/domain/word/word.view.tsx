import { Word } from "@prisma/client";
import { ActionFunction, LoaderFunction } from "@remix-run/router";
import { getWordsByUserId } from "~/domain/word/word.server";
import { getUser } from "~/session.server";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";

import { Button } from "~/components/common";
import { EmptyWordPlaceholder, WordCard } from "~/domain/word/components";

export const wordAction: ActionFunction = () => {
  return null;
};

type WordLoaderData = {
  words: Awaited<ReturnType<typeof getWordsByUserId>>;
};

export const wordLoader: LoaderFunction = async ({
  request,
}): Promise<WordLoaderData> => {
  const user = await getUser(request);
  const words = await getWordsByUserId(user!.id);
  return { words };
};

export const WordView = () => {
  const { words } = useLoaderData() as WordLoaderData;
  const submit = useSubmit();
  const navigate = useNavigate();

  const onClickCreate = () => {
    navigate("/new/word");
  };

  const onClickDeleteWord = (wordId: string) => () => {
    submit(null, {
      method: "post",
      action: `/delete/word/${wordId}`,
      replace: false,
    });
  };

  const onClickWordCard = (wordId: string) => () => {
    navigate(`/word/${wordId}`);
  };

  return (
    <>
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold text-blue-700">Dashboard</h1>
        <Button onClick={onClickCreate}>create</Button>
      </div>
      <div className="mt-4">
        {!!words && words.length === 0 && (
          <EmptyWordPlaceholder onCreate={onClickCreate} />
        )}
        <div className="grid gap-4 grid-cols-5 ">
          {!!words &&
            words.map((word) => {
              return (
                <WordCard
                  word={word}
                  onClick={onClickWordCard(word.id)}
                  onDelete={onClickDeleteWord(word.id)}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};
