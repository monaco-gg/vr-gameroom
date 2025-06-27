import Image from "next/legacy/image";
import { DB } from "../app/utils/storage";
import { GAME_STATE } from "../app/contexts/EngineContext";

export default function Blocked() {
  return (
    <div className="bg-black text-white flex items-center justify-center min-h-screen">
      <div className="text-center justify-center p-12 w-full">
        <Image
          src="/icons/orientation.png"
          width={128}
          height={128}
          alt={"orientation"}
          className="mx-auto"
          style={{
            maxWidth: "100%",
            height: "auto"
          }} />
        <p className="mb-4">
          Vire seu celular na vertical para jogar e clique no botão.
        </p>
        <button
          className="bg-green-500 text-white px-4 py-2 w-full rounded"
          onClick={() => {
            DB.setState(GAME_STATE.LOADING);
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }}
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}
