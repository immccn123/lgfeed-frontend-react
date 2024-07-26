import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request: { url } }: LoaderFunctionArgs) {
  const uid = new URL(url).searchParams.get("uid");
  if (uid === null) throw redirect(`/user`);
  throw redirect(`/user/${uid}`);
}
