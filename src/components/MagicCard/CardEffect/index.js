import Image from "next/legacy/image";
import "./card.css";

export default function CardEffect({ front }) {
  return (
    <div className="card p-4" style={{ width: 330 }}>
      <div className="card-inner">
        <div className="card-back bg-primary rounded-2xl">
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={150}
            height={150}
            className="rounded-t-lg"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
        <div className="card-front bg-neutral-900 rounded-2xl border-primary border-2">
          <div className="reflection"></div>
          <div className="flex flex-col">
            <Image
              src={front}
              width={300}
              height={330}
              alt={"card"}
              className="rounded-t-lg"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <p className="p-4 text-center">Caminho não encontrado, volte!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
