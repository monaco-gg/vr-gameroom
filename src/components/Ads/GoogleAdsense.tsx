import Script from "next/script";

type Props = {
  pId: string;
};

const GoogleAdsense: React.FC<Props> = ({ pId }) => {
  
  if (process.env.NEXT_PUBLIC_ENABLE_ADS !== "true") {
  return null;
}
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

export default GoogleAdsense;