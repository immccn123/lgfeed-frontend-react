import { useEffect, useState } from "react";
import "./styles/ad.css";

interface Props {
  type: "auto" | "fluid";
}

export default function CommonAd({ type: _type }: Partial<Props>) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    try {
      if (!isMounted) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsMounted(true);
      }
    } catch (e) {
      console.log(e);
    }
  });

  const type = _type ?? "auto";
  const height = type === "fluid" ? "90px" : undefined;
  const responsive = type === "auto";

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: responsive ? "inline-block" : "block",
        height,
        width: "100%",
        // background: "black"
      }}
      data-ad-client="ca-pub-4905414776827944"
      data-ad-slot="3969315658"
      data-ad-format="auto"
      data-full-width-responsive={responsive ? "true" : undefined}
    ></ins>
  );
}
