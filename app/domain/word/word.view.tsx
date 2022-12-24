import { Word } from "@prisma/client";
import { ActionFunction, LoaderFunction } from "@remix-run/router";
import { getWordsByUserId } from "~/domain/word/word.server";
import { getUser } from "~/session.server";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";

import { Button } from "~/components/common";

export const wordAction: ActionFunction = () => {
  return null;
};

export const wordLoader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const words = await getWordsByUserId(user!.id);
  return { words };
};

export const WordView = () => {
  const { words } = useLoaderData<{ words: Word[] }>();
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
        {words.length === 0 && (
          <div className="w-1/4 mx-auto bg-blue-100 p-4 rounded-sm border-0 border-slate-900">
            <div className="text-2xl text-blue-500 font-bold">
              <p>No words yet!</p>
              <p>Let's create one!</p>
            </div>
            <div className="mt-4">
              <Button onClick={onClickCreate}>create</Button>
            </div>
          </div>
        )}
        <div className="grid gap-4 grid-cols-5 ">
          {words.map((word) => {
            return (
              <div className="bg-blue-100 rounded-sm" key={word.id}>
                <a
                  className="block p-2 font-bold text-2xl text-blue-500 border-blue-50 border-b-2 cursor-pointer"
                  onClick={onClickWordCard(word.id)}
                >
                  {word.title}
                </a>
                <div className="p-2 text-blue-500">
                  <p>{word.description}</p>
                  <div className="flex justify-end">
                    <Button onClick={onClickDeleteWord(word.id)}>delete</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
