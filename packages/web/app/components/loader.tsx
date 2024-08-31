import { PropsWithChildren } from "react";
import { Loader } from "semantic-ui-react";

interface Props {
  height?: number | string
}


export const SegmentLoader = ({ children, height }: PropsWithChildren<Props>) => {
  return (
    <div style={{ minHeight: 100, height: height ?? "fit-content" }}>
      <Loader active>{children ?? "少女祈祷中……"}</Loader>
    </div>
  );
};
