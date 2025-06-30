import { Image } from "@nextui-org/react";

export default function GameCover({ game }) {
  return (
    <div
      className={`relative mb-4 rounded-lg m-4 ${
        !game.avaliable && "border-2 border-yellow-400"
      }`}
    >
      <Image
        alt={game.title}
        src={game.icon}
        width="100%"
        className={`rounded-lg shadow-l`}
      />
      {/* Development Badge */}
      {!game.avaliable && (
        <span className="absolute top-0 z-10 my-4 bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
          Em desenvolvimento
        </span>
      )}
      <div className="bg-opacity-55 p-4 rounded-b-lg text-center text-balance text-sm
                      bg-primary hover:bg-opacity-80">        
          VER JOGO        
      </div>
    </div>
  );
}
