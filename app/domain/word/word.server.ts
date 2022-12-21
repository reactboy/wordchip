import type { Word, User } from "@prisma/client";

import { prisma } from "~/db.server";

export const createWord = async (word: Word): Promise<Word> => {
  return prisma.word.create({
    data: {
      ...word
    }
  });
};

export const getWord = async (wordId: Word["id"]): Promise<Word | null> => {
  return prisma.word.findUnique({
    where: {
      id: wordId
    }
  });
};

export const getWordsByUserId = async (userId: User["id"]): Promise<Word[] | null> => {
  return prisma.word.findMany({
    where: {
      userId
    }
  });
};

export const updateWord = async (word: Word): Promise<Word | null> => {
  const { id, title, description, updatedBy } = word;
  return prisma.word.update({
    where: {
      id
    },
    data: {
      title,
      description,
      updatedBy
    }
  });
};

export const deleteWord = async (wordId: Word["id"]): Promise<Word | null> => {
  return prisma.word.delete({
    where: {
      id: wordId
    }
  });
};