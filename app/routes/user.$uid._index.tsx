import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ params }: LoaderFunctionArgs) {
  throw redirect(`/user/${params.uid}/1`);
}
