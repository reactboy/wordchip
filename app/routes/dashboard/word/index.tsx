import { ActionFunction, LoaderFunction } from "@remix-run/router";
import { getWordsByUserId } from "~/domain/word/word.server";
import { getUser } from "~/session.server";
import { Link, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";

import { Button } from "~/components/common";
import { EmptyWordPlaceholder, WordCard } from "~/domain/word/components";
import { IconCirclePlus } from "@tabler/icons";

export const action: ActionFunction = () => {
  return null;
};

type WordLoaderData = {
  words: Awaited<ReturnType<typeof getWordsByUserId>>;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<WordLoaderData> => {
  const user = await getUser(request);
  const words = await getWordsByUserId(user!.id);
  return { words };
};

export default function WordView() {
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
          {!!words && !!words.length && (
            <>
              {words.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  onClick={onClickWordCard(word.id)}
                  onDelete={onClickDeleteWord(word.id)}
                />
              ))}
              <Link className="block" to="/new/word">
                <div className="bg-blue-100 py-4">
                  <div className="text-blue-500 flex justify-center">
                    <IconCirclePlus size={40} />
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
