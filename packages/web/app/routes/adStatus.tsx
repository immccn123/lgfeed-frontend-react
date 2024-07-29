import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = request.url;
  if (url.includes("removeAd")) {
    return new Response(JSON.stringify(false), {
      headers: {
        "Set-Cookie": "noAd=1;",
      },
    });
  }
  if (url.includes("addAd")) {
    return new Response(JSON.stringify(true), {
      headers: {
        "Set-Cookie": "noAd=0",
      },
    });
  }
  return new Response(
    JSON.stringify(!request.headers.get("cookie")?.includes("noAd=1")),
  );
};
