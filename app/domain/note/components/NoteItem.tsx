import { FC, useEffect, useRef, useState } from "react";
import { Note } from "@prisma/client";
import classNames from "classnames";
import { Button, FormInput } from "~/components/common";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { IconTrashX, IconEdit, IconBackspace, IconSend } from "@tabler/icons";

export const validator = withZod(
  z.object({
    comment: z.string().min(1, { message: "comment required" }),
  })
);

type NoteItemProps = {
  note: Note;
  onDelete: () => void;
};

export const NoteItem: FC<NoteItemProps> = (props) => {
  const { note, onDelete } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    if (!editInputRef.current) return;
    editInputRef.current.focus();
  }, [isEditing]);

  const noteClass = classNames("p-2", {
    "bg-blue-100 text-blue-700 text-md rounded-sm": note.kind === "note",
    "bg-yellow-100 text-yellow-700 text-md rounded-sm": note.kind === "tips",
    "bg-green-100 text-green-700 text-md rounded-sm": note.kind === "notice",
  });

  const inputClass = classNames({
    "": note.kind === "note",
    "bg-yellow-50 text-yellow-900 rounded-sm text-xl focus:outline-none placeholder:text-yellow-200":
      note.kind === "tips",
    "bg-green-50 text-green-900 rounded-sm text-xl focus:outline-none placeholder:text-green-200":
      note.kind === "notice",
  });

  const buttonClass = classNames({
    "": note.kind === "note",
    "text-neutral-50 bg-yellow-500": note.kind === "tips",
    "text-neutral-50 bg-green-500": note.kind === "notice",
  });

  const onClickEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className={noteClass}>
      {isEditing ? (
        <ValidatedForm
          className="flex justify-between"
          method="post"
          action={`/edit/note/${note.id}`}
          validator={validator}
          onSubmit={() => setIsEditing(false)}
        >
          <FormInput
            ref={editInputRef}
            name="comment"
            defaultValue={note.body}
            className={inputClass}
          />
          <div className="flex gap-1 items-center">
            <Button className={buttonClass} type="submit">
              <IconSend size={16} />
            </Button>
            <Button
              className="text-neutral-50 bg-red-400"
              onClick={onClickEdit}
            >
              <IconBackspace size={16} />
            </Button>
          </div>
        </ValidatedForm>
      ) : (
        <div className="flex justify-between">
          <p>{note.body}</p>
          <div className="flex gap-1">
            <Button className={buttonClass} onClick={onClickEdit}>
              <IconEdit size={16} />
            </Button>
            <Button className="text-neutral-50 bg-red-400" onClick={onDelete}>
              <IconTrashX size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
