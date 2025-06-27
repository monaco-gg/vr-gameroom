import "./pong.css";

export default function Banner() {
  return (
    <>
      <div className="flex justify-center items-center pt-10 lg:pt-0">
        <div className="rounded text-center">
          <h1 className="font-archivo font-bold text-5xl text-neutral-50 md:text-7xl text-balance">
            Monaco Game Room
          </h1>
          <p className="font-inter pt-2 text-wrap text-lg text-neutral-400 text-balance">
            Participe da competição de games clássicos e concorra a
            prêmios!
          </p>
          <div className="flex justify-center items-center pt-12 pb-20">
            <div className="pong"></div>
          </div>
        </div>
      </div>
    </>
  );
}
