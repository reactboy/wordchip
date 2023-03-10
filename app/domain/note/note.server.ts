import type { Note } from "@prisma/client";

import { prisma } from "~/db.server";

export const createNote = async (
  note: Omit<Note, "createdAt" | "updatedAt" | "id">
): Promise<Note> => {
  return prisma.note.create({
    data: {
      ...note,
    },
  });
};

export const getNoteById = async (noteId: Note["id"]): Promise<Note | null> => {
  return prisma.note.findUnique({
    where: {
      id: noteId,
    },
  });
};

export const updateNote = async (note: Partial<Note>): Promise<Note | null> => {
  const { id } = note;
  return prisma.note.update({
    where: {
      id,
    },
    data: {
      ...note,
    },
  });
};

export const deleteNote = async (noteId: Note["id"]): Promise<Note | null> => {
  return prisma.note.delete({
    where: {
      id: noteId,
    },
  });
};
