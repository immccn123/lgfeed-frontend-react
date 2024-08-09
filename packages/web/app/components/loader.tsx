import { PropsWithChildren } from "react";
import { Loader } from "semantic-ui-react";

export const SegmentLoader = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div style={{ height: 100 }}>
      <Loader active>{children ?? "少女祈祷中……"}</Loader>
    </div>
  );
};
