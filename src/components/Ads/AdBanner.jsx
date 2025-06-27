import { useEffect } from "react";

const AdBanner = ({ currentPath, className, slot }) => {
  useEffect(() => {
    try {
      window.addEventListener("load", function () {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [currentPath]);

  return (
    <div className={`my-4 w-full inline-block bg-black ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9746054923547036"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest="off"
      ></ins>
    </div>
  );
};

export default AdBanner;
