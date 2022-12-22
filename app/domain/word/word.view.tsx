import { Word } from "@prisma/client";
import { ActionFunction, LoaderFunction } from "@remix-run/router";
import { getWordsByUserId } from "~/domain/word/word.server";
import { getUser } from "~/session.server";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

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
  const navigate = useNavigate();

  const onClickCreate = () => {
    navigate("/new/word");
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={onClickCreate}>create</Button>
      </div>
      <div className="mt-4">
        {words.length === 0 && (
          <div className="w-1/4 mx-auto bg-neutral-50 p-4 rounded-xl border-0 border-slate-900">
            <div className="text-2xl text-slate-600 font-bold">
              <p>No words yet!</p>
              <p>Let's create one!</p>
            </div>
            <div className="mt-4">
              <Button onClick={onClickCreate}>create</Button>
            </div>
          </div>
        )}
        <div className="grid gap-4 grid-cols-5 ">
          {words.map((word, i) => {
            return (
              <Link
                to={`/word/${word.id}`}
                className="bg-neutral-100 rounded-md overflow-auto"
                key={i}
              >
                <div className="p-2 text-center font-bold text-2xl text-gray-50 bg-slate-800">
                  {word.title}
                </div>
                <div className="p-2 text-center text-gray-700">
                  {word.description} {word.id}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
