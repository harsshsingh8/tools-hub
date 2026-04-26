import { useEffect, useRef } from "react";

export default function AdSense({ slot, format = "auto", style = {} }) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (adRef.current && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="my-4 flex justify-center" style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-3710039701001727"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
