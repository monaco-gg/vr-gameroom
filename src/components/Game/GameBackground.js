export default function GameBackground({ imageUrl, children }) {
  // Tailwind CSS classes can still be used for other styling
  const bgStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    filter: "blur(20px)",
    width: "inherit",
    height: "100svh",
    position: "absolute",
    margin: 0,
    padding: 0,
    top: 0,
    left: 0,
    zIndex: "-999",
    overflow: "hidden",
  };

  return (
    <div className="overflow-hidden m-0 p-0 w-full">
      <div style={bgStyle} className="bg-no-repeat bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>
      <div className="relative z-10 px-8 py-6 text-white">{children}</div>
    </div>
  );
}
