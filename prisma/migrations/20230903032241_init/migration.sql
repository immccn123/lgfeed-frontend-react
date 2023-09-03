-- CreateTable
CREATE TABLE "FeedCollection" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "feeds" INTEGER[],

    CONSTRAINT "FeedCollection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedCollection_label_key" ON "FeedCollection"("label");
