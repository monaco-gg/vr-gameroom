import Image from "next/legacy/image";
export const MonacoinIcon = ({
  size,
  height,
  width,
  layout = "responsive",
  label = "",
  ...props
}) => {
  return (
    <Image
      src="/imgs/header/coin.png"
      width={size || width}
      height={size || height}
      alt={label}
      layout={layout}
    />
  );
};
