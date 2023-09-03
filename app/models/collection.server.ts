import { prisma } from "~/db.server";

export async function getCollection(collectionLabel: string) {
  return await prisma.feedCollection.findUnique({
    where: {
      label: collectionLabel,
    },
  });
}

export async function createCollection(feeds: number[], label: string) {
  return prisma.feedCollection.create({
    data: {
      feeds,
      label,
    },
  });
}
