import { Loader } from "semantic-ui-react";

export const SegmentLoader = ({ msg }: { msg?: string }) => {
  return (
    <div style={{ height: 100 }}>
      <Loader active>{msg ?? "少女祈祷中……"}</Loader>
    </div>
  );
};
