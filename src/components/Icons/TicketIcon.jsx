import Image from "next/legacy/image";
export const TicketIcon = ({
  size,
  height,
  width,
  layout = "responsive",
  label = "",
  ...props
}) => {
  return (
    <Image
      src="/imgs/header/ticket.png"
      width={size || width}
      height={size || height}
      alt={label}
      layout={layout}
    />
  );
};
