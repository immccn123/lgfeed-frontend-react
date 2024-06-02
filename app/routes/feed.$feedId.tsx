import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Feed, Segment } from "semantic-ui-react";
import useSWRImmutable from "swr/immutable";
import { ZodError, z } from "zod";
import { Benben } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";
import { BenbenItem } from "~/interfaces";
import { api } from "~/utils/api";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const checker = z.object({
    feedId: z.coerce
      .number({ invalid_type_error: "feedId 的类型必须为 number" })
      .min(1, { message: "feedId 必须大于或等于 1" }),
  });
  try {
    return checker.parse(params);
  } catch (e) {
    throw new Response(
      (e as ZodError).issues.map((x) => x.message).join("\n"),
      { status: 400 },
    );
  }
};

export default function FeedInfo() {
  const { feedId } = useLoaderData<typeof loader>();
  const { data } = useSWRImmutable<[BenbenItem, number]>(
    `/tools/getFeed/${feedId}`,
    (x: string) =>
      api
        .get<BenbenItem>(x)
        .then(({ data, status }) => [data, status] as [BenbenItem, number]),
  );

  const [benben, status] = data ?? [];

  return (
    <Segment>
      {status === 404}
      <Feed>{benben ? <Benben data={benben} /> : <SegmentLoader />}</Feed>
    </Segment>
  );
}
