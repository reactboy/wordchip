import { FC } from "react";
import { Word } from "@prisma/client";
import { Button } from "~/components/common";
import { Link } from "@remix-run/react";

type WordCardProps = {
  word: Word;
  onClick: () => void;
  onDelete: () => void;
};

export const WordCard: FC<WordCardProps> = (props) => {
  const { word, onClick, onDelete } = props;

  return (
    <div className="bg-blue-100 rounded-sm" key={word.id}>
      <a
        className="block p-2 font-bold text-2xl text-blue-500 border-blue-50 border-b-2 cursor-pointer"
        onClick={onClick}
      >
        {word.title}
      </a>
      <div className="p-2 text-blue-500">
        <p>{word.description}</p>
        <div className="flex justify-end gap-1">
          <Link to={`/edit/word/${word.id}`}>
            <Button>Edit</Button>
          </Link>
          <Button onClick={onDelete}>delete</Button>
        </div>
      </div>
    </div>
  );
};

type EmptyWordPlaceholderProps = {
  onCreate: () => void;
};

export const EmptyWordPlaceholder: FC<EmptyWordPlaceholderProps> = (props) => {
  const { onCreate } = props;
  return (
    <div className="w-1/4 mx-auto bg-blue-100 p-4 rounded-sm border-0 border-slate-900">
      <div className="text-2xl text-blue-500 font-bold">
        <p>No words yet!</p>
        <p>Let's create one!</p>
      </div>
      <div className="mt-4">
        <Button onClick={onCreate}>create</Button>
      </div>
    </div>
  );
};
