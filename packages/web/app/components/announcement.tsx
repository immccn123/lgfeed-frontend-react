import { useState } from "react";
import { Button, Message } from "semantic-ui-react";
import useSWR from "swr";

export const Announcement = () => {
  const { data: adStatus, mutate } = useSWR("/adStatus", (x) =>
    fetch(x)
      .then((x) => x.json())
      .then((x) => x as boolean),
  );

  const [isDisablingAd, setIsDisablingAd] = useState(false);
  const toogleAd = () => {
    setIsDisablingAd(true);
    fetch(`/adStatus?${adStatus ? "removeAd" : "addAd"}`).finally(() => {
      mutate();
      setIsDisablingAd(false);
    });
  };

  return (
    <Message>
      支持我们继续做下去！
      <a href="https://sponsor.imken.moe">捐赠（请备注为犇站）</a>
      {adStatus !== undefined ? (
        <>
          | {adStatus ? "若广告阻碍的您的浏览，请" : "或者"}
          <Button
            size="mini"
            loading={isDisablingAd}
            disabled={isDisablingAd}
            onClick={toogleAd}
            compact
          >
            {adStatus ? "关闭" : "开启"}广告
          </Button>（刷新后生效）。
        </>
      ) : null}
    </Message>
  );
};
