import type { Word, User } from "@prisma/client";

import { prisma } from "~/db.server";

export const createWord = async (
  word: Omit<Word, "id" | "updatedAt" | "createdAt">
): Promise<Word> => {
  const { userId, updatedBy, title, description, createdBy } = word;
  return prisma.word.create({
    data: {
      title,
      description,
      userId,
      createdBy,
      updatedBy,
    },
  });
};

export const getWord = async (wordId: Word["id"]): Promise<Word | null> => {
  return prisma.word.findUnique({
    where: {
      id: wordId,
    },
    include: {
      notes: true,
    },
  });
};

export const getWordsByUserId = async (
  userId: User["id"]
): Promise<Word[] | null> => {
  return prisma.word.findMany({
    where: {
      userId,
    },
  });
};

export const updateWord = async (word: Word): Promise<Word | null> => {
  const { id, title, description, updatedBy } = word;
  return prisma.word.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      updatedBy,
    },
  });
};

export const deleteWord = async (wordId: Word["id"]): Promise<Word | null> => {
  return prisma.word.delete({
    where: {
      id: wordId,
    },
  });
};
