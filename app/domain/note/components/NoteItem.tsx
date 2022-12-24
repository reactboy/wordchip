import { FC } from "react";
import { Note } from "@prisma/client";
import classNames from "classnames";
import { Button } from "~/components/common";

type NoteItemProps = {
  note: Note;
  onDelete: () => void;
};

export const NoteItem: FC<NoteItemProps> = (props) => {
  const { note, onDelete } = props;
  const noteClass = classNames("p-2", {
    "bg-blue-100 text-blue-700 text-md border-2 border-blue-500 rounded-md":
      note.kind === "note",
    "bg-yellow-100 text-yellow-700 text-md border-2 border-yellow-500 rounded-md":
      note.kind === "tips",
    "bg-green-100 text-green-700 text-md border-2 border-green-500 rounded-md":
      note.kind === "notice",
  });
  return (
    <div className={noteClass}>
      <div className="flex justify-between">
        <p>{note.body}</p>
        <Button onClick={onDelete}>delete</Button>
      </div>
    </div>
  );
};
