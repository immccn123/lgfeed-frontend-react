import { useEffect, useState } from "react";
import "./styles/ad.css";

export default function CommonAd(props: Partial<HTMLElement>) {
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

  return (
    <ins
      // @ts-ignore
      class="adsbygoogle"
      {...props}
      style={{ display: "block" }}
      data-ad-client="ca-pub-4905414776827944"
      data-ad-slot="3969315658"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
